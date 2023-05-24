package com.devbydikko.springbootlibrary.dao;

import com.devbydikko.springbootlibrary.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
