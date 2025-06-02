import { Link } from "react-router-dom";
import LinkButton from "../../ui/LinkButton";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from 'react-redux';
import CartItem from '../cart/CartItem'
import { clearCart, getCart } from "./cartSlice";
import EmptyCart from './EmptyCart'

function Cart() {
  const cart = useSelector(getCart);
  const username = useSelector(state=>state.user.username)

  const dispatch = useDispatch();

  function handleClearCart(){
    dispatch(clearCart())
  }

  if(!cart.length) return <EmptyCart/>
  return (
    <div className="py-3 px-4">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">Your cart, {username}</h2>


      <ul className="divide-y divide-stone-200 border-b mt-3">
        {cart.map((item)=> <CartItem item={item} key={item.id}/>)}
      </ul>

      <div className="mt-6 space-x-2">

      <Button type='primary' to="/order/new">Order pizzas</Button>
      <Button type='secondary' onClick={handleClearCart}>Clear cart</Button>
      </div>
    </div>
  );
}

export default Cart;
