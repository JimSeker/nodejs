package edu.cs4730.restdemo2;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.util.ArrayList;

import edu.cs4730.restdemo2.databinding.RowlayoutBinding;

/*
 * this adapter is very similar to the adapters used for listview, except a ViewHolder is required
 * see http://developer.android.com/training/improving-layouts/smooth-scrolling.html
 * except instead having to implement a ViewHolder, it is implemented within
 * the adapter.
 */

class myAdapter extends RecyclerView.Adapter<myAdapter.ViewHolder> {

    private ArrayList<myObj> myList;
    private Context mContext;

    // Define listener member variable
    private OnItemClickListener listener;

    // Define the listener interface
    interface OnItemClickListener {
        void onItemClick(String mid, String name, String score);
    }

    // Define the method that allows the parent activity or fragment to define the listener
    void setOnItemClickListener(OnItemClickListener listener) {
        this.listener = listener;
    }


    myAdapter(ArrayList<myObj> myList, Context context) {
        this.myList = myList;
        this.mContext = context;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        RowlayoutBinding v = RowlayoutBinding.inflate(LayoutInflater.from(mContext), viewGroup, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(final ViewHolder viewHolder, int i) {

        myObj entry;
        entry = myList.get(i);

        viewHolder.viewBinding.tvId.setText(String.valueOf(entry.id));
        viewHolder.viewBinding.tvName.setText(entry.name);
        viewHolder.viewBinding.tvScore.setText(String.valueOf(entry.score));

        viewHolder.viewBinding.cardview.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (listener != null) {
                    listener.onItemClick(viewHolder.viewBinding.tvId.getText().toString(), viewHolder.viewBinding.tvName.getText().toString(), viewHolder.viewBinding.tvScore.getText().toString());
                }

                //Toast.makeText(mContext, "id is " + viewHolder.tvID.getText().toString(), Toast.LENGTH_LONG).show();
            }
        });


    }

    @Override
    public int getItemCount() {
        return myList == null ? 0 : myList.size();
    }

    public void setData(ArrayList<myObj> list) {
        myList = list;
        notifyDataSetChanged();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        public RowlayoutBinding viewBinding;

        ViewHolder(RowlayoutBinding viewBinding) {
            super(viewBinding.getRoot());
            this.viewBinding = viewBinding;

        }
    }
}
