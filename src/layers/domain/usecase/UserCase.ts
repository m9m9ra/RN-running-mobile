import {UserRepository} from "../repository/UserRepository";
import {User} from "../entity/User";
import moment from "moment/moment";
import {supabase} from "../../data/source/network/Supabase";

export class UserCase extends UserRepository{
    public user: User;
    public auth: boolean = false;

    public getLocalUser = async (): Promise<User | null> => {
        const user = await this.userRepository.findOne({
            where: {
                auth: true || false
            },
            relations: {
                activity: true,
                training: {
                    polyline: true
                }
            }
        });

        if (user !== null) {
            console.log(`Storage loaded!`);
            console.log(user);
            this.user = user;
            return this.user;
        } else {
            const newuser = Object.assign(new User(), {
                auth: false,
                guest: false,
                firstName: ``,
                lastName: ``,
                gender: `NOT_SAY`,
                email: ``,
                password: ``,
                birthdate: ``,
                policy: false,
            });
            this.user = newuser;
            this.auth = newuser.auth;

            return this.user;
        }
    };

    public authUser = async (password: string, email: string): Promise<User | null> => {
        if (this.user && this.auth) {
            return this.user
        }
        // todo - Guest auth
        let remoteUser = await supabase()
            .from('user')
            .select()
            .eq('email', email);

        if (remoteUser.data) {
            if (password == remoteUser.data[0].password) {
                const {data, error} = await supabase().auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                const userTraining = await supabase()
                    .from('training')
                    .select(`*, polyline`)
                    .eq(`userIdUserId`, remoteUser.data[0].user_id);

                console.log(userTraining.data);

                const userActivity = await supabase()
                    .from('activity')
                    .select()
                    .eq(`user_id`, remoteUser.data[0].user_id);

                console.log(data, error);
                console.log(await supabase().auth.getSession());

                this.user = remoteUser.data[0];
                this.user.auth = true;
                this.user.guest = true;
                this.user.training = userTraining.data == null ? [] : userTraining.data;
                this.user.activity = userActivity.data == null ? [] : userActivity.data;

                await this.userRepository.save(this.user);
                supabase().from(`user`).update({...this.user}).eq('email', this.user.email);

                return this.user;
            }

        } else {
            return null;
        }
    };

    public loginUser = async (user: User): Promise<User | null> => {
        // todo - Guest auth
        let remoteUser = await supabase()
            .from('user')
            .select()
            .eq('email', user.email);

        console.log(remoteUser);

        if (remoteUser.data.length >= 1) {
            return null;
        } else {
            remoteUser = await supabase()
                .from('user')
                .insert({
                    auth: user.auth,
                    guest: user.guest,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    email: user.email,
                    password: user.password,
                    birthdate: user.birthdate,
                    policy: user.policy,
                    height: 172,
                    weight: 64,
                    phone: user.phone,
                    token: user.token,
                    avatar: user.avatar,
                });

            console.log(remoteUser, "insert");

            remoteUser = await supabase()
                .from('user')
                .select()
                .eq('email', user.email);

            console.log(remoteUser);

            this.user = remoteUser.data[0];

            const {data, error} = await supabase().auth.signUp({
                email: user.email,
                password: user.password,
            });

            console.log(data, error);
            console.log(await supabase().auth.getSession());

            this.user.auth = true;
            this.user.guest = true;
            this.user.training = [];
            this.user.activity = [];

            console.log('Auth fix', this.user);

            const change = await this.userRepository.save(this.user);

            this.user = change;
            this.auth = change.auth;
            console.log('Remote fix', this.user);

            return this.user
        }
    };

    public updateUser = async (): Promise<User | null> => {
        const user = await this.userRepository.findOne({
            where: {
                auth: true || false
            },
            relations: {
                activity: true,
                training: {
                    polyline: true
                }
            }
        });

        await supabase().from('user').update(user).eq('email', this.user.email);

        this.user = user;
        this.user.training = this.user.training.sort((a, b) => {
            // @ts-ignore
            return moment(b.data, 'DD.MM.YY') - moment(a.data, 'DD.MM.YY');
        });

        return user;
    };

    public userLogout = async (): Promise<User | null> => {
        if (this.user) {
            this.user.auth = false;

            await this.userRepository.save(this.user);

            await supabase().from(`user`).update(this.user).eq('email', this.user.email);
            console.log(this.user);
            return this.user
        } else {
            return null
        }
    };
}