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
export interface Menu {
    "Item_name":string;
    "price":number;
    "image":string;
    "description":string;
    "Category":string;
    "id":number;
    "restaurants":Restaurant | string;
    "is_available": boolean;
    "incart": boolean;
}
export interface Restaurant {
    id:number;
    Res_name :string;
    image:string;
    address:string;
    description:string;
    phone:string;
    email:string;
    opening_time:string;
    closing_time:string;
    cuisine_type:string;
    map_logitude:Number;
    map_latiude:Number;
    rating:string
}

export interface User {
  id: number;
  first_name:string;
  last_name:string
  username: string;
  email: string;
  role: string;
  phone:string;
}