public class b {
    public static void main(String[] args) {
        // Boxing (primitive → object)
        int a = 5;
        Integer obj = a;   // auto-boxing
        System.out.println("Primitive int: " + a);
        System.out.println("Boxed Integer: " + obj);

        // Unboxing (object → primitive)
        Integer obj2 = 20;
        int b = obj2;   // auto-unboxing
        System.out.println("Integer object: " + obj2);
        System.out.println("Unboxed int: " + b);
    }
}
