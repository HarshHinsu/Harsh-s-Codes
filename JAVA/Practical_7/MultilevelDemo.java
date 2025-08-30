// Parent class
class Vehicle {
    void start() {
        System.out.println("Vehicle starts");
    }
}

// Child class
class Car extends Vehicle {
    void drive() {
        System.out.println("Car is driving");
    }
}

// Grandchild class
class ElectricCar extends Car {
    void charge() {
        System.out.println("Electric Car is charging");
    }
}

public class MultilevelDemo {
    public static void main(String[] args) {
        ElectricCar ec = new ElectricCar();
        ec.start();   // from Vehicle
        ec.drive();   // from Car
        ec.charge();  // ElectricCar's own
    }
}
