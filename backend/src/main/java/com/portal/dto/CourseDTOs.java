package com.portal.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;
import java.util.Map;

public class CourseDTOs {

    @Data
    public static class CourseRequest {
        @NotBlank private String title;
        private String description;
        private String category;
        private String thumbnailUrl;
        private String videoUrl;
        private Integer durationMinutes;
    }

    @Data @AllArgsConstructor
    public static class CourseResponse {
        private Long id;
        private String title;
        private String description;
        private String category;
        private String thumbnailUrl;
        private String videoUrl;
        private Integer durationMinutes;
        private String instructorName;
        private long enrollmentCount;
    }

    @Data @AllArgsConstructor
    public static class EnrollmentResponse {
        private Long id;
        private Long courseId;
        private String courseTitle;
        private Integer progressPercent;
        private String status;
        private String enrolledAt;
    }

    @Data
    public static class ProgressRequest {
        @Min(0) @Max(100)
        private Integer progressPercent;
    }

    @Data
    public static class QuizRequest {
        @NotBlank private String title;
        private List<QuestionRequest> questions;
    }

    @Data
    public static class QuestionRequest {
        @NotBlank private String questionText;
        private String optionA;
        private String optionB;
        private String optionC;
        private String optionD;
        @NotBlank private String correctAnswer;
    }

    @Data @AllArgsConstructor
    public static class QuizResponse {
        private Long id;
        private String title;
        private List<QuestionResponse> questions;
    }

    @Data @AllArgsConstructor
    public static class QuestionResponse {
        private Long id;
        private String questionText;
        private String optionA;
        private String optionB;
        private String optionC;
        private String optionD;
    }

    @Data
    public static class QuizSubmitRequest {
        private Map<Long, String> answers; // questionId -> selected answer
    }

    @Data @AllArgsConstructor
    public static class QuizResultResponse {
        private Long resultId;
        private String quizTitle;
        private int score;
        private int total;
        private double percentage;
    }
}
