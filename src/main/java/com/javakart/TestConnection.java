// src/test/java/com/javakart/TestConnection.java
package com.javakart;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class TestConnection implements CommandLineRunner {
    
    @Autowired
    private DataSource dataSource;
    
    @Override
    public void run(String... args) throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            System.out.println("✅ Database Connected Successfully!");
            System.out.println("Database: " + conn.getMetaData().getDatabaseProductName());
            System.out.println("URL: " + conn.getMetaData().getURL());
        } catch (Exception e) {
            System.out.println("❌ Database Connection Failed!");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}