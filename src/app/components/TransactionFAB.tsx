"use client";

import { useState, useEffect } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const categories = [
  { name: 'Food', emoji: '🍔', color: '#7C6EF7' },
  { name: 'Transport', emoji: '🚗', color: '#4ECDC4' },
  { name: 'Shopping', emoji: '🛍️', color: '#FFB84D' },
  { name: 'Entertainment', emoji: '🎬', color: '#FF8A80' },
  { name: 'Bills', emoji: '📄', color: '#6B7280' },
  { name: 'Health', emoji: '❤️', color: '#86EFAC' },
];

export function TransactionFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState<typeof categories[0] | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[0] | null>(null);

  useEffect(() => {
    if (description.length > 3) {
      setIsThinking(true);
      const timeout = setTimeout(() => {
        const lowerDesc = description.toLowerCase();
        let suggested = null;

        if (lowerDesc.includes('breakfast') || lowerDesc.includes('lunch') || lowerDesc.includes('dinner') || lowerDesc.includes('coffee') || lowerDesc.includes('restaurant')) {
          suggested = categories[0];
        } else if (lowerDesc.includes('grab') || lowerDesc.includes('taxi') || lowerDesc.includes('uber') || lowerDesc.includes('gas')) {
          suggested = categories[1];
        } else if (lowerDesc.includes('shop') || lowerDesc.includes('store') || lowerDesc.includes('buy')) {
          suggested = categories[2];
        } else if (lowerDesc.includes('movie') || lowerDesc.includes('concert') || lowerDesc.includes('game')) {
          suggested = categories[3];
        } else if (lowerDesc.includes('bill') || lowerDesc.includes('electricity') || lowerDesc.includes('water')) {
          suggested = categories[4];
        } else if (lowerDesc.includes('gym') || lowerDesc.includes('health') || lowerDesc.includes('doctor')) {
          suggested = categories[5];
        }

        setSuggestedCategory(suggested);
        setSelectedCategory(suggested);
        setIsThinking(false);
      }, 800);

      return () => clearTimeout(timeout);
    } else {
      setSuggestedCategory(null);
      setSelectedCategory(null);
    }
  }, [description]);

  const handleSave = () => {
    console.log('Saving transaction:', { description, amount, category: selectedCategory });
    setIsOpen(false);
    setDescription('');
    setAmount('');
    setSuggestedCategory(null);
    setSelectedCategory(null);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl z-50 max-w-md mx-auto"
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3 mb-4"></div>

            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">New entry</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-surface-elevated rounded-lg transition-colors"
                >
                  <X size={20} className="text-text-secondary" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Description</label>
                  <input
                    type="text"
                    placeholder="What did you spend on?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
                    autoFocus
                  />

                  <AnimatePresence>
                    {isThinking && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg"
                      >
                        <Sparkles size={14} className="text-primary animate-pulse" />
                        <span className="text-xs text-primary">AI is thinking...</span>
                      </motion.div>
                    )}

                    {suggestedCategory && !isThinking && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mt-3 flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg"
                      >
                        <span className="text-base">{suggestedCategory.emoji}</span>
                        <span className="text-sm text-foreground font-medium">{suggestedCategory.name}</span>
                        <span className="text-xs text-primary ml-auto">85% match</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Amount</label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-text-secondary"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      ₱
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 pl-10 py-3 text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-2xl"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat)}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedCategory?.name === cat.name
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-background hover:bg-surface-elevated'
                        }`}
                      >
                        <div className="text-2xl mb-1">{cat.emoji}</div>
                        <div className="text-xs text-foreground">{cat.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-text-secondary mb-2 block">Date</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={!description || !amount || !selectedCategory}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground py-4 rounded-lg font-medium transition-all disabled:cursor-not-allowed"
                >
                  Save entry
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-7 right-7 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium transition-all z-30"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={{
          boxShadow: [
            '0 4px 16px rgba(124, 110, 247, 0.3)',
            '0 4px 24px rgba(124, 110, 247, 0.5)',
            '0 4px 16px rgba(124, 110, 247, 0.3)',
          ],
        }}
        transition={{
          boxShadow: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        <Plus size={20} />
        <span>Add</span>
      </motion.button>
    </>
  );
}
