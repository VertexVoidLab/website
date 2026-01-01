import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export const EmailForm = () => {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const [message, setMessage] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setStatus('loading');

		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});

			if (res.ok) {
				setStatus('success');
				setMessage("Check your inbox for the download link.");
				setEmail('');
			} else {
				throw new Error('Something went wrong.');
			}
		} catch (err) {
			setStatus('error');
			setMessage('Failed to join. Please try again.');
		}
	};

	return (
		<div className="w-full max-w-sm">
			<AnimatePresence mode="wait">
				{status === 'success' ? (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="flex items-center gap-3 rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-green-400"
					>
						<Check className="h-5 w-5" />
						<span className="text-sm font-medium">{message}</span>
					</motion.div>
				) : (
					<motion.form
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						onSubmit={handleSubmit}
						className="relative group"
					>
						<div className="relative flex items-center">
							<input
								type="email"
								placeholder="enter@your.email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={status === 'loading'}
								className={cn(
									'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-4 pr-12 text-sm text-white placeholder:text-neutral-500 outline-none transition-all duration-200',
									'focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10',
									'hover:border-white/20',
									status === 'error' &&
									'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
								)}
							/>
							<button
								type="submit"
								disabled={status === 'loading' || !email}
								className="absolute right-1.5 p-2 rounded-md bg-purple-600 text-white opacity-0 scale-90 transition-all duration-200 group-focus-within:opacity-100 group-focus-within:scale-100 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{status === 'loading' ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<ArrowRight className="h-4 w-4" />
								)}
							</button>
						</div>
						{status === 'error' && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								className="mt-2 flex items-center gap-2 text-xs text-red-400"
							>
								<AlertCircle className="h-3 w-3" />
								{message}
							</motion.div>
						)}
					</motion.form>
				)}
			</AnimatePresence>
		</div>
	);
};
