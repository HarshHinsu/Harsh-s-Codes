class Student {
    // static variable (shared by all objects)
    static String college = "L.E. College";

    String name;
    int rollNo;

    // Constructor using 'this' keyword
    Student(String name, int rollNo) {
        this.name = name;       // 'this' refers to current object's variable
        this.rollNo = rollNo;
    }

    // Method to display student details
    void display() {
        System.out.println("Name: " + this.name + ", Roll No: " + this.rollNo + ", College: " + college);
    }
}

public class a {
    public static void main(String[] args) {
        Student s1 = new Student("Harsh", 101);
        Student s2 = new Student("Raj", 102);

        s1.display();
        s2.display();

        // Changing static variable (affects all objects)
        Student.college = "GTU";

        s1.display();
        s2.display();
    }
}
