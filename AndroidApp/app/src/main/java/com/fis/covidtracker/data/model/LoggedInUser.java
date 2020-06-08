package com.fis.covidtracker.data.model;

/**
 * Data class that captures user information for logged in users retrieved from LoginRepository
 */
public class LoggedInUser {

    private String token;

    public LoggedInUser(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

}