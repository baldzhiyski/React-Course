import { Link } from "react-router-dom";
import {useSelector} from 'react-redux'
import { getTotalCartItems, getTotalCartPrice } from "./cartSlice";

function CartOverview() {
  const totalCartQuantity = useSelector(getTotalCartItems)
  const totalCartPrice = useSelector(getTotalCartPrice);

  if(!totalCartQuantity) return null

  return (
    <div className="flex items-center justify-between bg-stone-800 text-stone-200 
    uppercase px-4 py-4 sm:px-6 text-sm md:text-base">
      <p className="text-stone-300 font-semibold space-x-4  sm:space-x-6">
        <span> {totalCartQuantity} pizzas</span>
        <span>${totalCartPrice}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
