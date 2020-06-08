package com.fis.covidtracker.ui.login;

import android.Manifest;
import android.app.Activity;

import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts.RequestMultiplePermissions;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.annotation.StringRes;
import androidx.appcompat.app.AppCompatActivity;

import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.fis.covidtracker.CheckInCheckOut;
import com.fis.covidtracker.R;
import com.fis.covidtracker.Scanner;

import java.util.Map;

public class LoginActivity extends AppCompatActivity {

    private LoginViewModel loginViewModel;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        loginViewModel = ViewModelProviders.of(this, new LoginViewModelFactory())
                .get(LoginViewModel.class);

        // register the permissions callback
        ActivityResultLauncher<String[]> mRequestPermissions =
                registerForActivityResult(new RequestMultiplePermissions(),
                        (ActivityResultCallback<Map<String, Boolean>>) result -> {
                            Log.d("Permissions", "Permissions results returned");
                            if (!result.isEmpty() && (Boolean) result.get(Manifest.permission.CAMERA)) {
                                // Permission is granted. Continue the action or workflow
                                // in your app.
                                Log.d("Permissions", "Permissions results granted");
                            } else {
                                // permission denied, exit
                                Log.d("Permissions", "Permissions results denied");
                                LoginActivity.this.finishAffinity();
                                System.exit(0);
                            }
                            return;
                        });


        //check for camera permission
        if (ContextCompat.checkSelfPermission(
                this, Manifest.permission.CAMERA) ==
                PackageManager.PERMISSION_GRANTED) {
            //CAMERA permission granted
            Log.d("Permission", "Permission already allowed");
        } else {
            //permissions need to be requested
            mRequestPermissions.launch(new String[] {Manifest.permission.CAMERA});
            Log.d("Permission", "Permissions launched");
        }

        //check for already logged in user
        SharedPreferences sharedPreferences = this.getSharedPreferences(getString(R.string.shared_pref_file), MODE_PRIVATE);
        String userName = sharedPreferences.getString(getString(R.string.user_token_key), null);
        if(userName != null && !userName.isEmpty()) {
            //user is already signed in, skip login
            this.startActivity(new Intent(this, CheckInCheckOut.class));
        }

        final EditText userTokenEditText = findViewById(R.id.userToken);
        final Button loginButton = findViewById(R.id.login);
        final ProgressBar loadingProgressBar = findViewById(R.id.loading);

        loginViewModel.getLoginFormState().observe(this, new Observer<LoginFormState>() {
            @Override
            public void onChanged(@Nullable LoginFormState loginFormState) {
                if (loginFormState == null) {
                    return;
                }
                loginButton.setEnabled(loginFormState.isDataValid());
                if (loginFormState.getUsernameError() != null) {
                    userTokenEditText.setError(getString(loginFormState.getUsernameError()));
                }
            }
        });

        //update viewmodel when token entered
        TextWatcher afterTextChangedListener = new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                // ignore
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                // ignore
            }

            @Override
            public void afterTextChanged(Editable s) {
                loginViewModel.loginDataChanged(userTokenEditText.getText().toString());
            }
        };
        userTokenEditText.addTextChangedListener(afterTextChangedListener);

        // attempt login on button press
        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loadingProgressBar.setVisibility(View.VISIBLE);
                loginViewModel.login(userTokenEditText.getText().toString(), LoginActivity.this);
            }
        });
    }

    private void showLoginFailed(@StringRes Integer errorString) {
        Toast.makeText(getApplicationContext(), errorString, Toast.LENGTH_SHORT).show();
    }
}