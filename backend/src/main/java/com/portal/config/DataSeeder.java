package com.portal.config;

import com.portal.model.*;
import com.portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final QuizRepository quizRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // ── Users ─────────────────────────────────────────────────────────────
        User instructor = userRepository.save(User.builder()
                .fullName("Prof. Rajesh Kumar").email("instructor@smartlearn.com")
                .password(passwordEncoder.encode("instructor123")).role(User.Role.INSTRUCTOR).build());

        userRepository.save(User.builder()
                .fullName("Admin User").email("admin@smartlearn.com")
                .password(passwordEncoder.encode("admin123")).role(User.Role.ADMIN).build());

        userRepository.save(User.builder()
                .fullName("Demo Student").email("student@smartlearn.com")
                .password(passwordEncoder.encode("student123")).role(User.Role.STUDENT).build());

        // ── Java Courses ──────────────────────────────────────────────────────
        saveCourse("Java Programming for Beginners",
            "Start your Java journey from scratch! Learn variables, data types, operators, conditionals and loops. Perfect for complete beginners with no prior programming experience.",
            "Core Java", "https://www.youtube.com/embed/eIrMbAQSU34", 300, instructor);

        saveCourse("Object Oriented Programming in Java",
            "Master the four pillars of OOP — Encapsulation, Inheritance, Polymorphism, and Abstraction. Build real-world projects using classes and objects in Java.",
            "Core Java", "https://www.youtube.com/embed/6T_HgnjoYwM", 360, instructor);

        saveCourse("Java Collections Framework",
            "Deep dive into List, Set, Map, Queue and their implementations. Learn when to use ArrayList vs LinkedList, HashMap vs TreeMap, and master the Collections utility class.",
            "Core Java", "https://www.youtube.com/embed/GdAon80-0KA", 240, instructor);

        saveCourse("Exception Handling in Java",
            "Write robust Java programs using try-catch-finally, custom exceptions, throws/throw keywords and best practices for production-level error handling.",
            "Core Java", "https://www.youtube.com/embed/W-N2ltgU-X4", 180, instructor);

        saveCourse("Java Multithreading & Concurrency",
            "Unlock parallel programming. Learn threads, synchronization, locks, ExecutorService, and Java concurrency utilities to build high-performance applications.",
            "Advanced Java", "https://www.youtube.com/embed/r_MbozD32eo", 300, instructor);

        saveCourse("Java 8 Features — Lambdas & Streams",
            "Modern Java with Lambda expressions, Stream API, Optional, Method References, Functional Interfaces and the new Date-Time API introduced in Java 8.",
            "Advanced Java", "https://www.youtube.com/embed/t1-YZ6bF-g0", 270, instructor);

        saveCourse("Spring Boot — Build REST APIs",
            "Build production-ready REST APIs using Spring Boot. Covers dependency injection, Spring MVC, JPA, security basics, and API testing with Postman.",
            "Spring Framework", "https://www.youtube.com/embed/9SGDpanrc8U", 420, instructor);

        saveCourse("Java Data Structures & Algorithms",
            "Crack coding interviews! Learn Arrays, LinkedLists, Stacks, Queues, Trees, Graphs, Sorting and Searching algorithms implemented in Java.",
            "DSA", "https://www.youtube.com/embed/RBSGKlAvoiM", 480, instructor);

        // ── Full Stack Courses ────────────────────────────────────────────────
        saveCourse("HTML & CSS for Beginners",
            "Build beautiful web pages from scratch! Learn HTML5 structure, CSS3 styling, Flexbox, Grid layout, responsive design and modern UI best practices.",
            "Full Stack", "https://www.youtube.com/embed/mU6anWqZJcc", 240, instructor);

        saveCourse("JavaScript Complete Course",
            "Master JavaScript from basics to advanced. Covers variables, functions, DOM manipulation, ES6+ features, Promises, async/await and fetch API.",
            "Full Stack", "https://www.youtube.com/embed/PkZNo7MFNFg", 360, instructor);

        saveCourse("React JS — Build Modern UIs",
            "Learn React from scratch. Components, Props, State, Hooks (useState, useEffect), React Router, Context API and building real-world single page applications.",
            "Full Stack", "https://www.youtube.com/embed/bMknfKXIFA8", 420, instructor);

        saveCourse("Node.js & Express — Backend Development",
            "Build scalable backend applications with Node.js and Express. REST APIs, middleware, authentication, MongoDB integration and deployment basics.",
            "Full Stack", "https://www.youtube.com/embed/Oe421EPjeBE", 360, instructor);

        saveCourse("MySQL Database Design & SQL",
            "Master relational databases! Learn SQL queries, joins, indexes, stored procedures, transactions and database design principles from beginner to advanced.",
            "Full Stack", "https://www.youtube.com/embed/7S_tz1z_5bA", 300, instructor);

        saveCourse("Full Stack Project — Java + React",
            "Build a complete full stack application with Spring Boot backend and React frontend. Covers REST API integration, JWT auth, deployment and best practices.",
            "Full Stack", "https://www.youtube.com/embed/5PdEmeopJVQ", 480, instructor);

        System.out.println("✅ 14 courses seeded (8 Java + 6 Full Stack) with quizzes!");
        System.out.println("📧 student@smartlearn.com / student123");
        System.out.println("📧 instructor@smartlearn.com / instructor123");
        System.out.println("📧 admin@smartlearn.com / admin123");
    }

    private void saveCourse(String title, String desc, String cat, String video, int duration, User instructor) {
        Course course = courseRepository.save(Course.builder()
                .title(title).description(desc).category(cat)
                .videoUrl(video).durationMinutes(duration).instructor(instructor).build());
        createQuiz(course);
    }

    private void createQuiz(Course course) {
        Quiz quiz = new Quiz();
        quiz.setTitle("Quiz: " + course.getTitle());
        quiz.setCourse(course);
        quiz.setQuestions(getQuestions(course.getTitle(), quiz));
        quizRepository.save(quiz);
    }

    private List<Question> getQuestions(String title, Quiz quiz) {

        // ── Java Beginners ────────────────────────────────────────────────────
        if (title.contains("Beginners")) return List.of(
            q(quiz,"Which keyword declares an integer variable?","var","int","integer","num","B"),
            q(quiz,"Correct syntax to print Hello World?","print('Hello World')","echo('Hello World')","System.out.println(\"Hello World\");","console.log('Hello World')","C"),
            q(quiz,"Which is NOT a primitive type in Java?","int","boolean","String","char","C"),
            q(quiz,"Default value of int in Java?","null","1","0","-1","C"),
            q(quiz,"Single line comment in Java?","<!-- -->","/* */","//","#","C"),
            q(quiz,"JVM stands for?","Java Virtual Memory","Java Virtual Machine","Java Variable Method","Java Version Manager","B"),
            q(quiz,"Entry point of a Java program?","start()","run()","main()","init()","C"),
            q(quiz,"Size of int in Java?","8 bits","16 bits","32 bits","64 bits","C"),
            q(quiz,"Operator for string concatenation?","*","+","&","||","B"),
            q(quiz,"Extension of compiled Java file?",".java",".class",".jar",".exe","B")
        );

        // ── OOP ───────────────────────────────────────────────────────────────
        if (title.contains("Object Oriented")) return List.of(
            q(quiz,"Which concept allows inheriting from another class?","Encapsulation","Polymorphism","Inheritance","Abstraction","C"),
            q(quiz,"Keyword to create an object?","create","object","new","make","C"),
            q(quiz,"Access modifier accessible only within its class?","public","protected","default","private","D"),
            q(quiz,"What is method overloading?","Same name different return type","Same name different parameters","Different name same parameters","Same name same parameters","B"),
            q(quiz,"Keyword to refer to current object?","self","me","this","current","C"),
            q(quiz,"What is an abstract class?","Class with no methods","Class that cannot be extended","Class that cannot be instantiated","Class with only static methods","C"),
            q(quiz,"Which concept hides implementation details?","Inheritance","Polymorphism","Encapsulation","Abstraction","C"),
            q(quiz,"What is an interface in Java?","Class with only static methods","Blueprint with abstract methods","A final class","A private class","B"),
            q(quiz,"Keyword to implement an interface?","extends","implements","inherits","uses","B"),
            q(quiz,"What is method overriding?","Redefining in same class","Redefining in subclass","Creating a new method","Deleting a method","B")
        );

        // ── Collections ───────────────────────────────────────────────────────
        if (title.contains("Collections")) return List.of(
            q(quiz,"Which allows duplicate elements?","Set","HashSet","ArrayList","TreeSet","C"),
            q(quiz,"Which Map maintains insertion order?","HashMap","TreeMap","LinkedHashMap","Hashtable","C"),
            q(quiz,"Initial capacity of ArrayList?","5","10","16","20","B"),
            q(quiz,"Which collection is thread-safe?","ArrayList","HashMap","Vector","LinkedList","C"),
            q(quiz,"HashMap stores data as?","Array only","LinkedList only","Key-Value pairs","Stack","C"),
            q(quiz,"Which interface does ArrayList implement?","Set","List","Map","Queue","B"),
            q(quiz,"Time complexity of HashMap get()?","O(n)","O(log n)","O(1)","O(n²)","C"),
            q(quiz,"Which does NOT allow null keys?","HashMap","LinkedHashMap","TreeMap","Hashtable","D"),
            q(quiz,"Difference between List and Set?","List is faster","Set allows duplicates","List allows duplicates Set does not","No difference","C"),
            q(quiz,"Which implements Queue using linked list?","ArrayList","LinkedList","TreeMap","HashSet","B")
        );

        // ── Exception Handling ────────────────────────────────────────────────
        if (title.contains("Exception")) return List.of(
            q(quiz,"Parent of all exceptions in Java?","Error","RuntimeException","Throwable","Exception","C"),
            q(quiz,"Block always executed?","try","catch","finally","throws","C"),
            q(quiz,"What is a checked exception?","Exception at runtime","Exception at compile time","Exception in main","NullPointerException","B"),
            q(quiz,"Keyword to throw manually?","throws","throw","exception","raise","B"),
            q(quiz,"NullPointerException is?","Checked exception","Error","Unchecked exception","Custom exception","C"),
            q(quiz,"Which is NOT checked?","IOException","SQLException","NullPointerException","ClassNotFoundException","C"),
            q(quiz,"What does throws keyword do?","Throws an exception","Declares possible exceptions","Catches exceptions","Creates exceptions","B"),
            q(quiz,"How to create custom exception?","Extend Throwable","Extend Exception class","Implement Exception interface","Use @Exception","B"),
            q(quiz,"Catching multiple exceptions uses?","multi-catch with |","double catch","try-finally","throws multiple","A"),
            q(quiz,"Uncaught exception causes?","Program continues","JVM terminates program","Exception ignored","Program restarts","B")
        );

        // ── Multithreading ────────────────────────────────────────────────────
        if (title.contains("Multithreading")) return List.of(
            q(quiz,"Interface to create a thread?","Runnable","Threadable","Executable","Concurrent","A"),
            q(quiz,"Method to start thread execution?","run()","execute()","start()","begin()","C"),
            q(quiz,"Keyword for thread safety?","volatile","static","synchronized","final","C"),
            q(quiz,"What is deadlock?","Slow program","Two threads waiting indefinitely","Thread running forever","Exception in thread","B"),
            q(quiz,"Class for thread pool management?","ThreadGroup","Runnable","ExecutorService","ThreadLocal","C"),
            q(quiz,"volatile keyword does?","Makes variable constant","Makes variable visible across threads","Synchronizes methods","Creates thread","B"),
            q(quiz,"Method to pause thread temporarily?","pause()","wait()","sleep()","stop()","C"),
            q(quiz,"Thread starvation means?","Thread with no memory","Thread never gets CPU time","Thread with no name","Deadlocked thread","B"),
            q(quiz,"Method that releases lock and waits?","sleep()","yield()","wait()","stop()","C"),
            q(quiz,"Purpose of join() method?","Joins two threads","Waits for thread to finish","Combines results","Creates new thread","B")
        );

        // ── Lambda ────────────────────────────────────────────────────────────
        if (title.contains("Lambda")) return List.of(
            q(quiz,"Java version that introduced Lambdas?","Java 6","Java 7","Java 8","Java 9","C"),
            q(quiz,"Lambda expression syntax?","() -> {}","[] -> {}","() => {}","<> -> {}","A"),
            q(quiz,"Stream API is used for?","Network streaming","Processing collections","File streaming","Thread management","B"),
            q(quiz,"Converts collection to stream?","toStream()","stream()","asStream()","makeStream()","B"),
            q(quiz,"filter() in Streams does?","Creates new stream","Selects elements matching condition","Sorts elements","Counts elements","B"),
            q(quiz,"Optional is used to?","Make variables optional","Avoid NullPointerException","Optional imports","Optional threads","B"),
            q(quiz,"Which is a functional interface?","Serializable","Runnable","Cloneable","Comparable","B"),
            q(quiz,"map() in Stream API does?","Maps keys to values","Transforms each element","Filters elements","Counts elements","B"),
            q(quiz,"Terminal operation to collect results?","filter()","map()","collect()","stream()","C"),
            q(quiz,"Method reference is?","Shorthand for lambda","Reference to variable","Method pointer","Method annotation","A")
        );

        // ── Spring Boot ───────────────────────────────────────────────────────
        if (title.contains("Spring Boot")) return List.of(
            q(quiz,"Annotation for Spring Boot application?","@Application","@SpringBootApp","@SpringBootApplication","@Boot","C"),
            q(quiz,"Annotation to create REST controller?","@Controller","@Service","@RestController","@Component","C"),
            q(quiz,"What does @Autowired do?","Creates object","Injects dependencies","Marks REST endpoint","Configures database","B"),
            q(quiz,"Annotation for HTTP GET requests?","@PostMapping","@GetMapping","@RequestMapping","@HttpGet","B"),
            q(quiz,"Default embedded server?","JBoss","Jetty","WebLogic","Tomcat","D"),
            q(quiz,"Annotation for service component?","@Repository","@Controller","@Service","@Component","C"),
            q(quiz,"JPA stands for?","JSON Processing API","Java Persistence API","JavaScript API","Job Processing API","B"),
            q(quiz,"Spring Boot properties file?","config.xml","settings.java","application.properties","spring.config","C"),
            q(quiz,"@PathVariable does?","Maps request body","Extracts value from URL","Sets response header","Maps query params","B"),
            q(quiz,"HTTP status for resource created?","200","204","201","301","C")
        );

        // ── DSA ───────────────────────────────────────────────────────────────
        if (title.contains("Data Structures")) return List.of(
            q(quiz,"Time complexity of binary search?","O(n)","O(n²)","O(log n)","O(1)","C"),
            q(quiz,"LIFO data structure?","Queue","Stack","LinkedList","Array","B"),
            q(quiz,"Time complexity of bubble sort?","O(n log n)","O(n)","O(n²)","O(log n)","C"),
            q(quiz,"FIFO data structure?","Stack","Array","Queue","Tree","C"),
            q(quiz,"Binary tree has?","2 children max per node","Exactly 2 nodes","Binary data","2 levels","A"),
            q(quiz,"Best sort for nearly sorted data?","Quick Sort","Merge Sort","Insertion Sort","Heap Sort","C"),
            q(quiz,"Traversal that visits root first?","Inorder","Postorder","Preorder","Level order","C"),
            q(quiz,"Time complexity of HashMap lookup?","O(n)","O(log n)","O(1)","O(n²)","C"),
            q(quiz,"Shortest path algorithm?","DFS","BFS","Dijkstra's","Bubble Sort","C"),
            q(quiz,"Dynamic programming means?","Real-time programming","Breaking into subproblems","Dynamic variables","Runtime programming","B")
        );

        // ── HTML & CSS ────────────────────────────────────────────────────────
        if (title.contains("HTML")) return List.of(
            q(quiz,"What does HTML stand for?","Hyper Text Markup Language","High Text Machine Language","Hyper Transfer Markup Language","Hyper Text Machine Link","A"),
            q(quiz,"Which tag is used for the largest heading?","<h6>","<h3>","<h1>","<heading>","C"),
            q(quiz,"Which CSS property changes text color?","font-color","text-color","color","text-style","C"),
            q(quiz,"Which is correct CSS syntax?","body{color:black;}","body:color=black;","{body;color:black;}","body[color=black]","A"),
            q(quiz,"What does CSS stand for?","Creative Style Sheets","Cascading Style Sheets","Computer Style Sheets","Colorful Style Sheets","B"),
            q(quiz,"Which HTML tag creates a hyperlink?","<a>","<link>","<href>","<url>","A"),
            q(quiz,"Which property sets background color?","bgcolor","background-color","bg-color","color-background","B"),
            q(quiz,"Flexbox property to align items horizontally?","align-items","justify-content","flex-direction","flex-wrap","B"),
            q(quiz,"Which tag creates an unordered list?","<ol>","<li>","<ul>","<list>","C"),
            q(quiz,"CSS Grid is used for?","Styling text","2D layout","Adding images","Animation","B")
        );

        // ── JavaScript ────────────────────────────────────────────────────────
        if (title.contains("JavaScript")) return List.of(
            q(quiz,"Which keyword declares a constant in JS?","var","let","const","def","C"),
            q(quiz,"How to write comment in JavaScript?","<!-- -->","/* */","//","#","C"),
            q(quiz,"Which is NOT a JS data type?","String","Boolean","Integer","Number","C"),
            q(quiz,"How to declare a function?","def func(){}","function func(){}","func = function","method func(){}","B"),
            q(quiz,"What does DOM stand for?","Document Object Model","Data Object Model","Document Oriented Model","Dynamic Object Manager","A"),
            q(quiz,"Which method adds element to array end?","push()","pop()","shift()","unshift()","A"),
            q(quiz,"What is a Promise used for?","Async operations","Storing data","DOM manipulation","CSS styling","A"),
            q(quiz,"Arrow function syntax?","function => {}","() => {}","=> function()","func -> {}","B"),
            q(quiz,"Which is used to fetch data from API?","XMLRequest","fetch()","getData()","apiCall()","B"),
            q(quiz,"What is JSON?","Java Script Object Notation","Java Serialized Object","JavaScript Oriented Network","Just Some Object Notation","A")
        );

        // ── React ─────────────────────────────────────────────────────────────
        if (title.contains("React")) return List.of(
            q(quiz,"What is React?","Backend framework","JavaScript UI library","Database tool","CSS framework","B"),
            q(quiz,"Hook used for state management?","useEffect","useContext","useState","useRef","C"),
            q(quiz,"What is JSX?","JavaScript XML syntax","JSON Extra","JavaScript Extension","Java Syntax","A"),
            q(quiz,"How to pass data to child component?","State","Props","Context","Ref","B"),
            q(quiz,"Hook used for side effects?","useState","useEffect","useCallback","useMemo","B"),
            q(quiz,"React Router is used for?","Styling","Navigation between pages","State management","API calls","B"),
            q(quiz,"What is a component in React?","A CSS class","A reusable UI piece","A database table","A server function","B"),
            q(quiz,"Virtual DOM helps in?","Server rendering","Direct DOM manipulation","Efficient UI updates","Database queries","C"),
            q(quiz,"Context API is used for?","Local state","Global state management","API calls","Routing","B"),
            q(quiz,"key prop in React lists is used for?","Styling list items","Identifying unique elements","Sorting items","Filtering items","B")
        );

        // ── Node.js ───────────────────────────────────────────────────────────
        if (title.contains("Node")) return List.of(
            q(quiz,"Node.js is built on?","Python","V8 JavaScript Engine","JVM","PHP Engine","B"),
            q(quiz,"Node.js is used for?","Frontend UI","Backend server development","Database design","CSS styling","B"),
            q(quiz,"npm stands for?","Node Package Module","Node Project Manager","Node Package Manager","New Project Manager","C"),
            q(quiz,"Express.js is?","A database","A CSS framework","A Node.js web framework","A testing tool","C"),
            q(quiz,"Which method handles GET requests in Express?","app.post()","app.get()","app.request()","app.fetch()","B"),
            q(quiz,"Middleware in Express?","Database connector","Functions that execute during request","CSS processor","Template engine","B"),
            q(quiz,"How to read request body in Express?","req.data","req.params","req.body","req.query","C"),
            q(quiz,"Which module handles file operations in Node?","http","path","fs","os","C"),
            q(quiz,"REST API returns data in which format?","XML only","HTML","JSON","CSV","C"),
            q(quiz,"Which HTTP method is used to update data?","GET","POST","PUT","DELETE","C")
        );

        // ── MySQL ─────────────────────────────────────────────────────────────
        if (title.contains("MySQL")) return List.of(
            q(quiz,"SQL stands for?","Simple Query Language","Structured Query Language","System Query Language","Standard Query Language","B"),
            q(quiz,"Which statement retrieves data?","INSERT","UPDATE","SELECT","DELETE","C"),
            q(quiz,"Which clause filters records?","ORDER BY","GROUP BY","WHERE","HAVING","C"),
            q(quiz,"Primary key must be?","Unique and not null","Null allowed","Duplicate allowed","Auto increment only","A"),
            q(quiz,"JOIN combines rows from?","One table","Two or more tables","Columns only","Views only","B"),
            q(quiz,"Which function counts rows?","SUM()","AVG()","COUNT()","MAX()","C"),
            q(quiz,"Foreign key is used for?","Primary identification","Referential integrity","Indexing","Partitioning","B"),
            q(quiz,"Which statement adds new row?","UPDATE","INSERT INTO","ALTER","CREATE","B"),
            q(quiz,"ORDER BY default sorts in?","Descending","Ascending","Random","Alphabetical","B"),
            q(quiz,"INNER JOIN returns?","All rows from both tables","Only matching rows","Left table rows","Right table rows","B")
        );

        // ── Full Stack Project ────────────────────────────────────────────────
        return List.of(
            q(quiz,"REST stands for?","Remote State Transfer","Representational State Transfer","Remote Server Technology","Reactive State Tool","B"),
            q(quiz,"HTTP method to create a resource?","GET","PUT","POST","DELETE","C"),
            q(quiz,"JWT stands for?","Java Web Tool","JSON Web Token","JavaScript Web Transfer","Java Web Transfer","B"),
            q(quiz,"CORS stands for?","Cross Origin Resource Sharing","Cross Object Request System","Client Origin Resource Service","Custom Object Request Sharing","A"),
            q(quiz,"Which status code means unauthorized?","403","404","401","500","C"),
            q(quiz,"API stands for?","Application Programming Interface","Application Process Integration","Automated Program Interface","Application Protocol Interface","A"),
            q(quiz,"Which HTTP method deletes a resource?","GET","POST","PUT","DELETE","D"),
            q(quiz,"Frontend communicates with backend via?","Direct database access","REST API calls","File sharing","SSH","B"),
            q(quiz,"Which status code means success?","404","500","200","301","C"),
            q(quiz,"MVC stands for?","Model View Controller","Method View Component","Module View Class","Main View Constructor","A")
        );
    }

    private Question q(Quiz quiz, String text, String a, String b, String c, String d, String correct) {
        Question q = new Question();
        q.setQuiz(quiz); q.setQuestionText(text);
        q.setOptionA(a); q.setOptionB(b); q.setOptionC(c); q.setOptionD(d);
        q.setCorrectAnswer(correct);
        return q;
    }
}
