public class abc {
    public static void main(String[] args) {
        String name = "Hello Java";

        // Different String functions
        System.out.println("Original String: " + name);
        System.out.println("Length: " + name.length());
        System.out.println("Uppercase: " + name.toUpperCase());
        System.out.println("Lowercase: " + name.toLowerCase());
        System.out.println("Character at index 1: " + name.charAt(1));
        System.out.println("Substring(0,5): " + name.substring(0,5));
        System.out.println("Replace Java with World: " + name.replace("Java","World"));
    }
}
