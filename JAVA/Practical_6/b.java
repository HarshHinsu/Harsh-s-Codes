class Book {
    String title;
    String author;

    // Default constructor
    Book() {
        title = "Unknown";
        author = "Unknown";
    }

    // Parameterized constructor (overloaded)
    Book(String title, String author) {
        this.title = title;
        this.author = author;
    }

    // Copy constructor
    Book(Book b) {
        this.title = b.title;
        this.author = b.author;
    }

    void display() {
        System.out.println("Title: " + title + ", Author: " + author);
    }
}

public class b {
    public static void main(String[] args) {
        // Using default constructor
        Book b1 = new Book();
        b1.display();

        // Using parameterized constructor
        Book b2 = new Book("Java Programming", "James Gosling");
        b2.display();

        // Using copy constructor
        Book b3 = new Book(b2);
        b3.display();
    }
}
