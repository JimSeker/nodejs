package edu.cs4730.restdemo2;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.DialogFragment;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.view.ContextThemeWrapper;

import android.view.LayoutInflater;

import edu.cs4730.restdemo2.databinding.FragmentMyDialogBinding;


/**
 * a dialog to add a new entry or edit an existing entry.
 */
public class myDialogFragment extends DialogFragment {

    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    private static final String ARG_PARAM3 = "param3";
    private static final String ARG_PARAM4 = "param4";

    private Boolean mParam1;
    private int mParam2;
    private String mParam3;
    private String mParam4;

    private OnFragmentInteractionListener mListener;

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param update or update a value.
     * @param id     Parameter 2.
     * @param name  Parameter 3.
     * @param score  Parameter 4.
     * @return A new instance of fragment myDialogFragment.
     */
    public static myDialogFragment newInstance(Boolean update, int id, String name, String score) {
        myDialogFragment fragment = new myDialogFragment();
        Bundle args = new Bundle();
        args.putBoolean(ARG_PARAM1, update);
        args.putInt(ARG_PARAM2, id);
        args.putString(ARG_PARAM3, name);
        args.putString(ARG_PARAM4, score);
        fragment.setArguments(args);
        return fragment;
    }

    public myDialogFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getBoolean(ARG_PARAM1, false);
            mParam2 = getArguments().getInt(ARG_PARAM2, -1);
            mParam3 = getArguments().getString(ARG_PARAM3, "");
            mParam4 = getArguments().getString(ARG_PARAM4, "");
        }
    }

    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {

        LayoutInflater inflater = getLayoutInflater();
        // Inflate the layout for this fragment
        FragmentMyDialogBinding binding = FragmentMyDialogBinding.inflate(inflater);

        if (mParam1) { //true it's an update
            binding.etName.setText(mParam3);
            binding.etScore.setText(mParam4);
        }
        AlertDialog.Builder builder = new AlertDialog.Builder(new ContextThemeWrapper(requireActivity(), androidx.appcompat.R.style.Theme_AppCompat));
        builder.setView(binding.getRoot());

        builder.setPositiveButton("Save", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int id) {
                if (mListener != null) {
                    mListener.onFragmentInteraction(mParam1, mParam2, binding.etName.getText().toString(), binding.etScore.getText().toString());
                }
                dismiss();
            }
        }).setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dismiss();
            }
        }).setCancelable(true);
        return builder.create();
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);

        try {
            mListener = (OnFragmentInteractionListener) requireActivity();
        } catch (ClassCastException e) {
            throw new ClassCastException(requireActivity().toString() + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p/>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    interface OnFragmentInteractionListener {

        void onFragmentInteraction(Boolean update, int id, String name, String score);
    }

}
