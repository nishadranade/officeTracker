package com.fis.covidtracker.ui.login;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import android.content.Context;
import android.util.Patterns;

import com.fis.covidtracker.data.LoginRepository;
import com.fis.covidtracker.data.Result;
import com.fis.covidtracker.data.model.LoggedInUser;
import com.fis.covidtracker.R;

public class LoginViewModel extends ViewModel {

    private MutableLiveData<LoginFormState> loginFormState = new MutableLiveData<>();
    private LoginRepository loginRepository;

    LoginViewModel(LoginRepository loginRepository) {
        this.loginRepository = loginRepository;
    }

    LiveData<LoginFormState> getLoginFormState() {
        return loginFormState;
    }


    public void login(String username, Context context) {
        // can be launched in a separate asynchronous job
        loginRepository.login(username, context);

    }

    public void loginDataChanged(String token) {
        if (!isUserNameValid(token)) {
            loginFormState.setValue(new LoginFormState(R.string.invalid_username));
        } else {
            loginFormState.setValue(new LoginFormState(true));
        }
    }

    // Token validation check
    private boolean isUserNameValid(String token) {
        if (token == null) {
            return false;
        } else {
            return !token.trim().isEmpty();
        }
    }

}