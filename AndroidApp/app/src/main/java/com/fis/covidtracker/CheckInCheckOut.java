package com.fis.covidtracker;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.fis.covidtracker.ui.login.LoginActivity;

import org.json.JSONException;
import org.json.JSONObject;

public class CheckInCheckOut extends AppCompatActivity {
    private Button checkIn, checkOut, logout;
    private SharedPreferences sharedPreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_check_in_check_out);

        checkIn = findViewById(R.id.checkIn);
        checkOut = findViewById(R.id.checkOut);
        logout = findViewById(R.id.logout);

        //find out if I am checkIn or checkOut
        sharedPreferences = getSharedPreferences(getString(R.string.shared_pref_file), MODE_PRIVATE);
        Log.d("Check In", "Is Check-In: " + sharedPreferences.getBoolean(getString(R.string.is_check_in_key), false));
        if(!sharedPreferences.getBoolean(getString(R.string.is_check_in_key), false)) {
            checkIn.setVisibility(View.INVISIBLE);
            checkOut.setVisibility(View.VISIBLE);
            Log.d("Check In", "I am a checkOut button");
        } else {
            checkIn.setVisibility(View.VISIBLE);
            checkOut.setVisibility(View.INVISIBLE);
            Log.d("Check In", "I am a check in button");
        }

        String toastMessage = getIntent().getStringExtra("successToast");
        Log.d("Check In", "" + toastMessage);
        if(toastMessage != null && !toastMessage.isEmpty()) {
            Log.d("Check In", "Showing toast");
            Toast.makeText(this, toastMessage , Toast.LENGTH_LONG).show();
        }

        checkIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openScanner(true);
            }
        });

        checkOut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                checkOut();
            }
        });

        logout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //remove login from sharedpref
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.remove(getString(R.string.user_token_key));
                editor.commit();

                //go back to login
                Intent intent = new Intent(CheckInCheckOut.this, LoginActivity.class);
                startActivity(intent);
            }
        });
    }

    private void openScanner(boolean isCheckIn) {
        Intent intent = new Intent(this, Scanner.class);
        intent.putExtra("is_check_in", isCheckIn);
        startActivity(intent);
    }

    /**
     * Check out of the meeting the user is currently in
     */
    private void checkOut() {

        String roomId = sharedPreferences.getString(getString(R.string.room_id_key), "");
        String username = sharedPreferences.getString(getString(R.string.user_token_key), "");

        sendPostRequest(roomId, username);

    }

    /**
     * Send a check out post request
     *
     * @param roomId id of the room scanned during last check in
     * @param username username of logged in user
     */
    private void sendPostRequest(String roomId, String username) {
        String baseURL = this.getString(R.string.base_url);
        RequestQueue queue = Volley.newRequestQueue(this);
        baseURL += "/checkOut";

        //create JSON
        JSONObject requestObject = new JSONObject();
        try {
            requestObject.put(getString(R.string.username_json_key), username);
            requestObject.put("roomId", roomId);
        } catch (JSONException je) {}

        //set up request
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, baseURL, requestObject,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        //Success
                        String success;
                        try{
                            success = response.getString("result");
                            SharedPreferences.Editor editor = sharedPreferences.edit();
                            editor.putBoolean(getString(R.string.is_check_in_key), true);
                            editor.apply();
                        } catch (JSONException je) {
                            success = "failed";
                        }

                        Log.d("Check In", String.format("Check out attempt %s", success));

                        //restart activity in alternate mode (if successful)
                        Intent intent = new Intent(CheckInCheckOut.this, CheckInCheckOut.class);
                        intent.putExtra("successToast", String.format("Check out attempt %s", success));
                        startActivity(intent);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                //check out failed
                Log.d("Check In", "Check out failed");
                Intent intent = new Intent(CheckInCheckOut.this, CheckInCheckOut.class);
                intent.putExtra("successToast", String.format("Check out attempt failed"));
                startActivity(intent);
            }
        });

        //add request to queue
        queue.add(jsonObjectRequest);
    }
}