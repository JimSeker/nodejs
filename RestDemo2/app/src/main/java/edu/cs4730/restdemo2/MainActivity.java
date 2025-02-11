package edu.cs4730.restdemo2;


import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import androidx.annotation.NonNull;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.ItemTouchHelper;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Toast;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.Authenticator;
import java.net.HttpURLConnection;
import java.net.PasswordAuthentication;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import edu.cs4730.restdemo2.databinding.ActivityMainBinding;

/**
 * an example of custom rest service.  Note, the rest service here will only answer to ip from on UW's campus
 * The service has a query.php, insert.php, update.php, and delete.php
 * The data returned from query is in a csv format.  The other three return a number that states
 * how "objects" where changed.
 * <p>
 * Authenticator info can be found here
 * http://docs.oracle.com/javase/6/docs/technotes/guides/net/http-auth.html  and
 * http://stackoverflow.com/questions/4883100/how-to-handle-http-authentication-using-httpurlconnection
 * <p>
 * SECURITY NOTE:
 * https really should be used so the username and password are encrypted, but our website doesn't have a valid cert,
 * if yours does, change it to https://... * and HttpsURLconnection and everything else is the same.
 * <p>
 * Note, https://koz.io/android-m-and-the-war-on-cleartext-traffic/
 * In the AndroidManifest.xml there is < application ... android:usesCleartextTraffic="true" ...
 * The test server doesn't have a legit cert, so... @#$@ it, cleartext it is.
 * For real app, with legit certs on web servers, you should use https and remove the above.
 */


public class MainActivity extends AppCompatActivity implements myDialogFragment.OnFragmentInteractionListener {
    String TAG = "MainActivity";
    ActivityMainBinding binding;
    myAdapter mAdapter;
    ArrayList<myObj> list = null;
    URI uri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        ViewCompat.setOnApplyWindowInsetsListener(binding.main, (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return WindowInsetsCompat.CONSUMED;
        });
        setSupportActionBar(binding.toolbar);

        try {
            uri = new URI("http://www.cs.uwyo.edu/~seker/rest/query.php");
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

        binding.fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //the user clicked the add button, so start the dialog with for add.
                myDialogFragment myDialog = myDialogFragment.newInstance(false, -1, "", "");
                myDialog.show(getSupportFragmentManager(), null);
            }
        });

        //setup the RecyclerView
        binding.list.setLayoutManager(new LinearLayoutManager(getApplicationContext()));
        binding.list.setItemAnimator(new DefaultItemAnimator());
        //setup the adapter, which is myAdapter, see the code.  set it initially to null
        //use the asynctask to set the data later after it is loaded.
        mAdapter = new myAdapter(null, getApplicationContext());
        mAdapter.setOnItemClickListener(new myAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(String mid, String mtitle, String mbody) {
                myDialogFragment myDialog = myDialogFragment.newInstance(true, Integer.parseInt(mid), mtitle, mbody);
                myDialog.show(getSupportFragmentManager(), null);
            }
        });
        //add the adapter to the recyclerview
        binding.list.setAdapter(mAdapter);

        //SwipeRefreshlayout setup.
        //setup some colors for the refresh circle.
        binding.activityMainSwipeRefreshLayout.setColorSchemeResources(R.color.orange, R.color.green, R.color.blue);
        //now setup the swiperefrestlayout listener where the main work is done.
        binding.activityMainSwipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                //where we call the refresher parts.
                doDataUpdate();  //refresh call, so reload the data from the internet.
            }
        });
        doDataUpdate();  //finally load the data via the internet.


        //setup left/right swipes on the cardviews for the delete.
        ItemTouchHelper.SimpleCallback simpleItemTouchCallback = new ItemTouchHelper.SimpleCallback(0, ItemTouchHelper.RIGHT) {
            @Override
            public boolean onMove(@NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder, @NonNull RecyclerView.ViewHolder target) {
                //likely allows to for animations?  or moving items in the view I think.
                return false;
            }

            @Override
            public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
                //called when it has been animated off the screen.  So item is no longer showing.
                //use ItemtouchHelper.X to find the correct one.

                if (direction == ItemTouchHelper.RIGHT) {
                    //user wants to delete this entry.
                    String name = ((myAdapter.ViewHolder) viewHolder).viewBinding.tvName.getText().toString();
                    logthis("deleting " + name);
                    //update the data for a name.
                    String path = EndPoints.URL_REST_SCORES + name;
                    //insert new data, then read back everything.
                    StringRequest stringRequest = new StringRequest(Request.Method.DELETE, path,
                        new Response.Listener<String>() {
                            @Override
                            public void onResponse(String response) {
                                logthis(response);
                                doDataUpdate();
                            }
                        },
                        new Response.ErrorListener() {
                            @Override
                            public void onErrorResponse(VolleyError error) {
                                logthis("volley failure" + error.toString());
                            }
                        }) {
                    };
                    MyVolley.getInstance(MainActivity.this).addToRequestQueue(stringRequest);
                }
            }
        };
        ItemTouchHelper itemTouchHelper = new ItemTouchHelper(simpleItemTouchCallback);
        itemTouchHelper.attachToRecyclerView(binding.list);
    }

    //simple method that is called by lots of different spots, to reload the query data.
    public void doDataUpdate() {
        binding.activityMainSwipeRefreshLayout.setRefreshing(true);
        //call the refresh code manually here.
        list = new ArrayList<myObj>();  //set the list.
        logthis("Fetching data...");

        StringRequest stringRequest = new StringRequest(Request.Method.GET, EndPoints.URL_GET_SCORES,
            new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    JSONObject obj = null;
                    try {
                        obj = new JSONObject(response);
                        if (!obj.getBoolean("error")) {
                            JSONArray jsonDevices = obj.getJSONArray("data");

                            for (int i = 0; i < jsonDevices.length(); i++) {
                                JSONObject d = jsonDevices.getJSONObject(i);
                                logthis(d.getString("name") + " " + d.getInt("score"));
                                list.add(new myObj(i, d.getString("name"), d.getInt("score")));
                            }

                            mAdapter.setData(list);
                            binding.activityMainSwipeRefreshLayout.setRefreshing(false);
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {

                }
            }) {

        };
        MyVolley.getInstance(this).addToRequestQueue(stringRequest);
    }

    //fragment listener for update/add for myDialogFragment
    //then setup the data structure for either update or insert and call the asynctask to do the work.
    @Override
    public void onFragmentInteraction(Boolean update, int id, String name, String score) {
        //return from dialog, now save the data.
        logthis("id " + id + name + score);
        if (update) {

            //update the data for a name.
            String path = EndPoints.URL_REST_SCORES + name;
            //insert new data, then read back everything.
            StringRequest stringRequest = new StringRequest(Request.Method.PUT, path,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        logthis(response);
                        doDataUpdate();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        logthis("volley failure" + error.toString());
                    }
                }) {
                @Override
                protected Map<String, String> getParams() throws AuthFailureError {
                    Map<String, String> params = new HashMap<>();
                    params.put("score", score);

                    return params;
                }
            };
            MyVolley.getInstance(this).addToRequestQueue(stringRequest);
        } else {
            //insert new data, then read back everything.
            StringRequest stringRequest = new StringRequest(Request.Method.POST, EndPoints.URL_REST_SCORES,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        logthis(response);
                        doDataUpdate();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        logthis("volley failure" + error.toString());
                    }
                }) {
                @Override
                protected Map<String, String> getParams() throws AuthFailureError {
                    Map<String, String> params = new HashMap<>();
                    params.put("name", name);
                    params.put("score", score);

                    return params;
                }
            };
            MyVolley.getInstance(this).addToRequestQueue(stringRequest);
        }
    }


    //helper method
    void logthis(String item) {
        Log.d(TAG, item);
//        binding.logger.append("\n");
//        binding.logger.append(item);
    }

}
