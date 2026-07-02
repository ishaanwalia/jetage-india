"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  MessageCircle,
  ArrowRight,
  Package,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart, buildWhatsAppMessage } from "@/context/CartContext";

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    totalMrp,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const discount = totalMrp - totalPrice;
  const whatsappUrl = `https://wa.me/919814958295?text=${buildWhatsAppMessage(items)}`;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-jet-bg-card border-l border-jet-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-jet-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-jet-primary/10 flex items-center justify-center border border-jet-primary/20">
                  <ShoppingCart className="w-5 h-5 text-jet-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-jet-text">Your Cart</h2>
                  <p className="text-sm text-jet-text-muted">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-xl bg-jet-bg-elevated flex items-center justify-center border border-jet-border hover:border-jet-primary/40 transition-all"
              >
                <X className="w-5 h-5 text-jet-text" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-jet-bg-elevated flex items-center justify-center mx-auto border border-jet-border">
                    <Package className="w-8 h-8 text-jet-text-muted" />
                  </div>
                  <p className="text-jet-text-dim font-medium">Your cart is empty</p>
                  <p className="text-sm text-jet-text-muted">
                    Add products to create a bulk WhatsApp order
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-jet-primary text-white rounded-full font-semibold hover:bg-jet-primary-dim transition-all"
                  >
                    Browse Products
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-4 bg-jet-bg rounded-2xl border border-jet-border group"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.productId}/`}
                      onClick={() => setIsCartOpen(false)}
                      className="shrink-0 w-20 h-20 bg-jet-bg-elevated rounded-xl border border-jet-border flex items-center justify-center overflow-hidden hover:border-jet-primary/30 transition-all"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-contain max-h-[70px] w-auto"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.productId}/`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-sm font-semibold text-jet-text leading-snug hover:text-jet-primary transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="shrink-0 p-1.5 rounded-lg text-jet-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-jet-text-muted mt-1">SKU: {item.sku}</p>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-lg bg-jet-bg-elevated border border-jet-border flex items-center justify-center text-jet-text hover:border-jet-primary/40 transition-all"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-jet-text">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-lg bg-jet-bg-elevated border border-jet-border flex items-center justify-center text-jet-text hover:border-jet-primary/40 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm font-bold text-jet-text">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-xs text-jet-text-muted line-through">
                            ₹{(item.mrp * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-jet-border space-y-4 bg-jet-bg-card">
                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-jet-text-muted">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-jet-success">
                      <span>You Save</span>
                      <span>−₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-jet-text-muted">
                    <span>Shipping</span>
                    <span className="text-jet-success">Free</span>
                  </div>
                  <div className="pt-2 border-t border-jet-border flex items-center justify-between">
                    <span className="font-bold text-jet-text">Total</span>
                    <span className="text-xl font-bold text-jet-text">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* WhatsApp Order Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-jet-whatsapp text-white rounded-xl font-bold text-lg hover:bg-[#128C7E] transition-all hover:scale-[1.02] shadow-lg"
                >
                  <MessageCircle className="w-6 h-6" />
                  Order All on WhatsApp
                </a>

                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 px-4 py-3 bg-jet-bg-elevated text-jet-text-muted border border-jet-border rounded-xl font-semibold hover:border-red-500/40 hover:text-red-500 transition-all text-sm"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="flex-1 px-4 py-3 bg-jet-bg-elevated text-jet-primary border border-jet-primary/20 rounded-xl font-semibold hover:bg-jet-primary hover:text-white transition-all text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
