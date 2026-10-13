package com.portal.service;

import com.portal.dto.CourseDTOs.*;
import com.portal.model.*;
import com.portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final QuizResultRepository quizResultRepository;

    @Transactional
    public QuizResponse createQuiz(Long courseId, QuizRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));

        Quiz quiz = Quiz.builder()
                .title(request.getTitle())
                .course(course)
                .build();

        List<Question> questions = request.getQuestions().stream()
                .map(q -> Question.builder()
                        .questionText(q.getQuestionText())
                        .optionA(q.getOptionA())
                        .optionB(q.getOptionB())
                        .optionC(q.getOptionC())
                        .optionD(q.getOptionD())
                        .correctAnswer(q.getCorrectAnswer())
                        .quiz(quiz)
                        .build())
                .collect(Collectors.toList());

        quiz.setQuestions(questions);
        Quiz saved = quizRepository.save(quiz);
        return toQuizResponse(saved);
    }

    public List<QuizResponse> getQuizzesByCourse(Long courseId) {
        return quizRepository.findByCourseId(courseId).stream()
                .map(this::toQuizResponse)
                .collect(Collectors.toList());
    }

    public QuizResponse getQuizById(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found: " + quizId));
        return toQuizResponse(quiz);
    }

    @Transactional
    public QuizResultResponse submitQuiz(Long quizId, String studentEmail, QuizSubmitRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found: " + quizId));
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Map<Long, String> answers = request.getAnswers();
        int score = 0;

        for (Question q : quiz.getQuestions()) {
            String submitted = answers.get(q.getId());
            if (submitted != null && submitted.equalsIgnoreCase(q.getCorrectAnswer())) {
                score++;
            }
        }

        int total = quiz.getQuestions().size();
        double percentage = total > 0 ? (score * 100.0 / total) : 0;

        QuizResult result = QuizResult.builder()
                .student(student)
                .quiz(quiz)
                .score(score)
                .totalQuestions(total)
                .build();
        QuizResult saved = quizResultRepository.save(result);

        return new QuizResultResponse(saved.getId(), quiz.getTitle(), score, total, percentage);
    }

    public List<QuizResultResponse> getStudentResults(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return quizResultRepository.findByStudentId(student.getId()).stream()
                .map(r -> new QuizResultResponse(r.getId(), r.getQuiz().getTitle(),
                        r.getScore(), r.getTotalQuestions(),
                        r.getTotalQuestions() > 0 ? (r.getScore() * 100.0 / r.getTotalQuestions()) : 0))
                .collect(Collectors.toList());
    }

    private QuizResponse toQuizResponse(Quiz quiz) {
        List<QuestionResponse> qList = quiz.getQuestions() == null ? List.of() :
                quiz.getQuestions().stream()
                        .map(q -> new QuestionResponse(q.getId(), q.getQuestionText(),
                                q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD()))
                        .collect(Collectors.toList());
        return new QuizResponse(quiz.getId(), quiz.getTitle(), qList);
    }
}
