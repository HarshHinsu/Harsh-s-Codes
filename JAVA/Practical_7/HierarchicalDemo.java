// Parent class
class Shape {
    void draw() {
        System.out.println("Drawing a shape");
    }
}

// Child 1
class Circle extends Shape {
    void area() {
        System.out.println("Area of Circle = pi r ^");
    }
}

// Child 2
class Rectangle extends Shape {
    void area() {
        System.out.println("Area of Rectangle = length * breadth");
    }
}

public class HierarchicalDemo {
    public static void main(String[] args) {
        Circle c = new Circle();
        c.draw(); 
        c.area();

        Rectangle r = new Rectangle();
        r.draw();
        r.area();
    }
}
