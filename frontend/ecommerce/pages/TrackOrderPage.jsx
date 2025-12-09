import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { OrderHistoryContext } from "../context/OrderHistoryContext";
import styles from "../styles/TrackOrderPage.module.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const statuses = ["Ordered", "Payment", "Confirmation", "Delivery"];

export default function TrackOrderPage() {
  const { transactions, refreshOrders } = useContext(OrderHistoryContext);
  const { addToCart, clearCart } = useContext(CartContext);
  const { token } = useAuth();
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  const handleDeliveryCompletion = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Delivered" }),
      });
      await refreshOrders();
    } catch (error) {
      console.error("Failed to update delivery status", error);
    }
  };

  useEffect(() => {
    const txn = transactions.find((t) => t.id.toString() === transactionId);
    if (!txn) return;

    setOrder(txn);
    
    // ✅ CRITICAL FIX: State Management
    if (txn.status === 'Delivered' || txn.status === 'Completed') {
        // If DB says done, show full green immediately
        setCurrentStatusIndex(statuses.length - 1);
    } else {
        // If DB says Pending, check local storage
        const saved = JSON.parse(localStorage.getItem(`track_${txn.id}`));
        
        // Safety Check: If local storage says "finished" (index 3) 
        // but DB says "Pending", ignore storage and restart animation.
        if (saved && saved.statusIndex < statuses.length - 1) {
            setCurrentStatusIndex(saved.statusIndex);
        } else {
            setCurrentStatusIndex(0); // Force start at 0
        }
    }
  }, [transactions, transactionId]);

  useEffect(() => {
    // Don't run animation if finished or cancelled
    if (!order || isCancelled || currentStatusIndex >= statuses.length - 1) return;

    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => {
        // Stop if we reach the end
        if (prev >= statuses.length - 1) {
          clearInterval(interval);
          return prev;
        }

        const next = prev + 1;
        
        // Save progress to storage
        localStorage.setItem(
          `track_${order.id}`,
          JSON.stringify({ statusIndex: next })
        );

        // ✅ FIX: Only trigger backend update when hitting the FINAL step
        if (next === statuses.length - 1) {
          handleDeliveryCompletion(order.id);
        }

        return next;
      });
    }, 2000); // 2 seconds per step for clear visualization

    return () => clearInterval(interval);
  }, [order, isCancelled, currentStatusIndex, token]);

  const handleBuyAgain = () => {
    clearCart();
    order.items.forEach((item) => {
      if (item.product) {
        addToCart({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price, 
          image: item.product.image_url,
          quantity: item.quantity,
        });
      }
    });
    navigate("/checkout");
  };

  if (!order) return <p className={styles.trackOrderMainContainer}>Loading order...</p>;

  return (
    <div className={styles.trackOrderMainContainer}>
      <div className={styles.orderItemsCard}>
        <h3>Order #{order.id} Items</h3>
        {order.items.map((item) => (
          <div key={item.id} className={styles.orderItemRow}>
            <img
              src={item.product?.image_url || item.image || "/placeholder.png"} 
              alt={item.name}
              className={styles.orderItemImage}
            />
            <div className={styles.orderItemInfo}>
              <p>{item.product?.name || item.name}</p>
              <p className={styles.orderItemPrice}>₱{Number(item.price).toFixed(2)} x {item.quantity}</p>
            </div>
          </div>
        ))}
        <p className={styles.orderTotal}>
            Total: ₱{Number(order.total_price).toFixed(2)}
        </p>
      </div>

      <div className={styles.trackOrderCard}>
        <div className={styles.trackOrderStatus}>
          {statuses.map((status, index) => (
            <div 
              key={index} 
              // ✅ Apply 'completed' only to steps BEFORE the current one
              // This triggers the line filling animation from left to right
              className={`${styles.statusStepContainer} ${
                index < currentStatusIndex ? styles.completed : ""
              }`}
            >
              <div
                className={`${styles.statusStep} ${
                  index <= currentStatusIndex ? styles.active : ""
                }`}
              />
              <span
                className={`${styles.statusLabel} ${
                  index <= currentStatusIndex ? styles.active : ""
                }`}
              >
                {status}
              </span>
            </div>
          ))}
          {isCancelled && <p className={styles.cancelledText}>Order Cancelled</p>}
        </div>

        <div className={styles.trackOrderButtons}>
          {/* Only show buttons when completely finished */}
          {currentStatusIndex === statuses.length - 1 && !isCancelled ? (
            <>
              {order.status !== 'Completed' && (
                <button
                    className={styles.rateOrderBtn}
                    onClick={() => navigate(`/rate-order/${order.id}`)}
                >
                    Rate Your Order
                </button>
              )}
              <button onClick={handleBuyAgain}>Buy Again</button>
            </>
          ) : (
            <>
              <button disabled className={styles.trackingBtn}>
                Tracking...
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsCancelled(true)}
              >
                Cancel Order
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}