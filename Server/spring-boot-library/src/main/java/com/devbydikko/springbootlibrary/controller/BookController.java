package com.devbydikko.springbootlibrary.controller;

import com.devbydikko.springbootlibrary.entity.Book;
import com.devbydikko.springbootlibrary.service.BookService;
import com.devbydikko.springbootlibrary.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
// The @CrossOrigin annotation above means our react app will be able to call this controller without getting a CORS error
public class BookController {
    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception {
        String payload = "\"sub\"";
        String userEmail = ExtractJWT.payloadJWTExtraction(token, payload);
        return bookService.checkoutBook(userEmail, bookId);
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean checkoutBookByUser(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) {
        String payload = "\"sub\"";
        String userEmail = ExtractJWT.payloadJWTExtraction(token, payload);
        return bookService.checkoutBookByUser(userEmail, bookId);
    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount(@RequestHeader(value = "Authorization") String token) {
        String payload = "\"sub\"";
        String userEmail = ExtractJWT.payloadJWTExtraction(token, payload);
        return bookService.currentLoansCount(userEmail);
    }

}
