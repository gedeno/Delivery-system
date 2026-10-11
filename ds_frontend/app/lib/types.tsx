export interface RegisterData{
     first_name:string;
     last_name:string;
     username:string;
     password:string
     email:string;
     role:string;
     phone:string;
     Delivery_status:string;
}
export interface LoginData{
    username:string;
    password:string

}
export interface TokenResponse{
    access:string;
    refresh:string;
}