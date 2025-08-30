// Base interface
interface A {
    int A_CONST = 10; // constant
    void methodA();   // abstract method
}

// Interface A1 extends A
interface A1 extends A {
    int A1_CONST = 20;
    void methodA1();
}

// Interface A2 extends A
interface A2 extends A {
    int A2_CONST = 30;
    void methodA2();
}

// Interface A12 extends both A1 and A2
interface A12 extends A1, A2 {
    int A12_CONST = 40;
    void methodA12();
}

// Class implementing A12
class Interface_Imple implements A12 {
    public void methodA() {
        System.out.println("methodA() called, Constant = " + A_CONST);
    }

    public void methodA1() {
        System.out.println("methodA1() called, Constant = " + A1_CONST);
    }

    public void methodA2() {
        System.out.println("methodA2() called, Constant = " + A2_CONST);
    }

    public void methodA12() {
        System.out.println("methodA12() called, Constant = " + A12_CONST);
    }
}

// Main class
public class InterfaceInheritanceDemo {
    public static void main(String[] args) {
        Interface_Imple obj = new Interface_Imple();

        obj.methodA();
        obj.methodA1();
        obj.methodA2();
        obj.methodA12();
    }
}
