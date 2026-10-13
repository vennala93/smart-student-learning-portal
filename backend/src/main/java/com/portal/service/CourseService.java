package com.portal.service;

import com.portal.dto.CourseDTOs.*;
import com.portal.model.*;
import com.portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::toCourseResponse)
                .collect(Collectors.toList());
    }

    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found: " + id));
        return toCourseResponse(course);
    }

    public List<CourseResponse> searchCourses(String keyword) {
        return courseRepository.searchByTitle(keyword).stream()
                .map(this::toCourseResponse)
                .collect(Collectors.toList());
    }

    public List<CourseResponse> getCoursesByCategory(String category) {
        return courseRepository.findByCategoryIgnoreCase(category).stream()
                .map(this::toCourseResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CourseResponse createCourse(CourseRequest request, String instructorEmail) {
        User instructor = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));
        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .thumbnailUrl(request.getThumbnailUrl())
                .videoUrl(request.getVideoUrl())
                .durationMinutes(request.getDurationMinutes())
                .instructor(instructor)
                .build();
        return toCourseResponse(courseRepository.save(course));
    }

    @Transactional
    public CourseResponse updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found: " + id));
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCategory(request.getCategory());
        course.setThumbnailUrl(request.getThumbnailUrl());
        course.setVideoUrl(request.getVideoUrl());
        course.setDurationMinutes(request.getDurationMinutes());
        return toCourseResponse(courseRepository.save(course));
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    // ── Enrollment ─────────────────────────────────────────────────────────────

    @Transactional
    public EnrollmentResponse enrollStudent(Long courseId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));

        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            throw new RuntimeException("Already enrolled in this course");
        }
        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .progressPercent(0)
                .status(Enrollment.Status.IN_PROGRESS)
                .build();
        return toEnrollmentResponse(enrollmentRepository.save(enrollment));
    }

    public List<EnrollmentResponse> getStudentEnrollments(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return enrollmentRepository.findByStudentId(student.getId()).stream()
                .map(this::toEnrollmentResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EnrollmentResponse updateProgress(Long courseId, String studentEmail, int progress) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Enrollment enrollment = enrollmentRepository
                .findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        enrollment.setProgressPercent(progress);
        if (progress >= 100) {
            enrollment.setStatus(Enrollment.Status.COMPLETED);
            enrollment.setCompletedAt(java.time.LocalDateTime.now());
        }
        return toEnrollmentResponse(enrollmentRepository.save(enrollment));
    }

    // ── Mappers ────────────────────────────────────────────────────────────────

    private CourseResponse toCourseResponse(Course c) {
        long count = enrollmentRepository.countByCourseId(c.getId());
        String instructor = c.getInstructor() != null ? c.getInstructor().getFullName() : "Unknown";
        return new CourseResponse(c.getId(), c.getTitle(), c.getDescription(),
                c.getCategory(), c.getThumbnailUrl(), c.getVideoUrl(),
                c.getDurationMinutes(), instructor, count);
    }

    private EnrollmentResponse toEnrollmentResponse(Enrollment e) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        return new EnrollmentResponse(e.getId(), e.getCourse().getId(),
                e.getCourse().getTitle(), e.getProgressPercent(),
                e.getStatus().name(),
                e.getEnrolledAt() != null ? e.getEnrolledAt().format(fmt) : "");
    }
}
