import {createClient} from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const supabase = () => createClient(`https://exleatosycdqwphigvbr.supabase.co`, `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4bGVhdG9zeWNkcXdwaGlndmJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIzMzM1NjgsImV4cCI6MjAyNzkwOTU2OH0.Kz0v89yP9liN-X7kpINsESCWYXNUzv1FJ4kXyOcXBI8`, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
});