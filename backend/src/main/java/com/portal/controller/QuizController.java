package com.portal.controller;

import com.portal.dto.CourseDTOs.*;
import com.portal.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping("/courses/{courseId}/quizzes")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<QuizResponse> createQuiz(@PathVariable Long courseId,
                                                    @RequestBody QuizRequest request) {
        return ResponseEntity.ok(quizService.createQuiz(courseId, request));
    }

    @GetMapping("/courses/{courseId}/quizzes")
    public ResponseEntity<List<QuizResponse>> getQuizzes(@PathVariable Long courseId) {
        return ResponseEntity.ok(quizService.getQuizzesByCourse(courseId));
    }

    @GetMapping("/quizzes/{quizId}")
    public ResponseEntity<QuizResponse> getQuiz(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.getQuizById(quizId));
    }

    @PostMapping("/quizzes/{quizId}/submit")
    public ResponseEntity<QuizResultResponse> submitQuiz(@PathVariable Long quizId,
                                                          @RequestBody QuizSubmitRequest request,
                                                          Principal principal) {
        return ResponseEntity.ok(quizService.submitQuiz(quizId, principal.getName(), request));
    }

    @GetMapping("/quiz-results/my")
    public ResponseEntity<List<QuizResultResponse>> myResults(Principal principal) {
        return ResponseEntity.ok(quizService.getStudentResults(principal.getName()));
    }
}
