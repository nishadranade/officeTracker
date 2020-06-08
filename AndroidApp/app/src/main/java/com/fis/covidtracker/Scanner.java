package com.fis.covidtracker;

import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.budiyev.android.codescanner.CodeScanner;
import com.budiyev.android.codescanner.CodeScannerView;
import com.budiyev.android.codescanner.DecodeCallback;
import com.google.zxing.Result;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

public class Scanner extends AppCompatActivity {
    private CodeScanner mCodeScanner;
    private boolean isCheckIn;
    private String type;
    private String toastMessage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //receive transfer of activities from CheckInCheckOut to Scanner
        Intent intent = getIntent();
        isCheckIn = intent.getBooleanExtra("is_check_in", true); //get the boolean

        //for toast feedback
        if(isCheckIn) {
            type = "Check-in";
        } else {
            type = "Check-out";
        }

        CodeScannerView scannerView = findViewById(R.id.scanner_view);
        TextView qrResult = findViewById(R.id.qrResult);

        mCodeScanner = new CodeScanner(this, scannerView);
        final Context activity = this;

        mCodeScanner.setDecodeCallback(new DecodeCallback() {
            @Override
            public void onDecoded(@NonNull final Result result) {
                qrResult.setText(result.getText());
                sendPostRequest(result.getText());
            }
        });

    }

    @Override
    protected void onResume() {
        super.onResume();
        mCodeScanner.startPreview();
    }

    @Override
    protected void onPause() {
        mCodeScanner.releaseResources();
        super.onPause();
    }

    private void sendPostRequest(String roomId) {
        String baseURL = getString(R.string.base_url);
        RequestQueue queue = Volley.newRequestQueue(this);
        baseURL += "/checkIn";

        JSONObject requestObject = new JSONObject();
        try {
            SharedPreferences sharedPreferences = this.getSharedPreferences(this.getString(R.string.shared_pref_file), MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPreferences.edit();
            String username = sharedPreferences.getString(this.getString(R.string.user_token_key), null);
            requestObject.put(getString(R.string.username_json_key), username);
            requestObject.put("roomId", roomId);
            editor.putString(getString(R.string.room_id_key), roomId);
            editor.putBoolean(getString(R.string.is_check_in_key), false);
            editor.commit();
        } catch (JSONException je) {
            Log.e("JsonException", je.getMessage());
        }

        //set up request
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, baseURL, requestObject,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        //Success
                        String success;
                        try{
                            success = response.getString("result");
                        } catch (JSONException je) {
                            success = "failed";
                            Log.e("JSONException", je.getMessage());
                        }

                        //user feedback
                        toastMessage = String.format("%s attempt %s", type, success);
                        Log.d("Check In", String.format("%s attempt %s", type, success));

                        //boot back to CheckInCheckOut
                        goToCheckInCheckOut();
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                //scanner failed
                toastMessage = String.format("%s attempt failed", type);
                Log.d("Check In", "Check in failed");
                goToCheckInCheckOut();
            }
        });

        //add request to queue
        queue.add(jsonObjectRequest);
    }

    private void goToCheckInCheckOut() {
        Intent intent = new Intent(this, CheckInCheckOut.class);
        intent.putExtra("successToast", toastMessage);
        startActivity(intent);
    }
}