import "react-native-url-polyfill/auto";
import {makeAutoObservable, runInAction} from "mobx";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class DataStore {
    public supabase: SupabaseClient;

    private url: string = `https://exleatosycdqwphigvbr.supabase.co`;
    private api_key: string = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4bGVhdG9zeWNkcXdwaGlndmJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIzMzM1NjgsImV4cCI6MjAyNzkwOTU2OH0.Kz0v89yP9liN-X7kpINsESCWYXNUzv1FJ4kXyOcXBI8`;
    constructor() {
        makeAutoObservable(this);
    };

    public main = async () => {
        this.supabase = createClient(this.url, this.api_key, {
            auth: {
                storage: AsyncStorage,
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: false,
            }
        });
    };

    public addUser = async (): Promise<boolean> => {
        return false
    };

    public updateUser = async (): Promise<boolean> => {
        return false
    };
};