package com.fis.covidtracker.data;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.StringRes;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.fis.covidtracker.CheckInCheckOut;
import com.fis.covidtracker.R;
import com.fis.covidtracker.data.model.LoggedInUser;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Class that requests authentication and user information from the remote data source and
 * maintains an in-memory cache of login status and user credentials information.
 */
public class LoginRepository {

    private static volatile LoginRepository instance;

    // If user credentials will be cached in local storage, it is recommended it be encrypted
    // @see https://developer.android.com/training/articles/keystore
    private LoggedInUser user = null;

    // private constructor : singleton access
    private LoginRepository() {
    }

    public static LoginRepository getInstance() {
        if (instance == null) {
            instance = new LoginRepository();
        }
        return instance;
    }

    public boolean isLoggedIn() {
        return user != null;
    }

    private void setLoggedInUser(LoggedInUser user, Context context) {
        this.user = user;
        // If user credentials will be cached in local storage, it is recommended it be encrypted
        // @see https://developer.android.com/training/articles/keystore

        //save token to shared preferences
        SharedPreferences sharedPreferences = context.getSharedPreferences(context.getString(R.string.shared_pref_file), Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(context.getString(R.string.user_token_key), user.getToken());
        editor.commit();
    }

    public LoggedInUser getLoggedInUser() {
        return this.user;
    }

    public void login(final String username, final Context context) {
        //prepare for post request
        String baseURL = context.getString(R.string.base_url);
        RequestQueue queue = Volley.newRequestQueue(context);
        final String url = baseURL + "/login";
        JSONObject requestObject = new JSONObject();
        try {
            requestObject.put(context.getString(R.string.username_json_key), username);
        } catch (JSONException je) {}

        //set up request
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, requestObject,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.d("JSON Response", "Response received from server on login");
                        //check response
                        String loggedIn = "";
                        try {
                            loggedIn = response.getString("result");
                        } catch (JSONException je) {
                        }

                        if (loggedIn.equalsIgnoreCase("success")) {
                            user = new LoggedInUser(username);
                            setLoggedInUser(user, context);
                            Intent intent = new Intent(context, CheckInCheckOut.class);
                            context.startActivity(intent);
                        } else {
                            Toast.makeText(context, context.getResources().getString(R.string.login_failed), Toast.LENGTH_SHORT).show();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                //login failed
            }
        });

        //add request to queue
        queue.add(jsonObjectRequest);

    }
}