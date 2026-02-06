import { useState } from 'react';
export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });
        try {
            const API_URL = process.env.REACT_APP_API_URL || '';
            const response = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const contentType = response.headers.get("content-type") || "";
            let data = null;
            if (contentType.includes("application/json")) {
            data = await response.json();
            } else {
            const text = await response.text();
            data = { error: text };
            }
            if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`);
            if (response.ok) {
                setStatus({ 
                    type: 'success', 
                    message: 'Thank you! Your message has been sent successfully.' 
                });
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error.message || 'Oops! Something went wrong. Please try again later.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <main className="contact-page">
            <div className="contact-left-panel">
                <div className="contact-intro">
                    <h1>Get in Touch</h1>
                    <img 
                        src="/images/contact-pic.jpg" 
                        alt="Contact" 
                        className="contact-image"
                    />
                    <p>
                        Looking to get in touch? Drop me a message - I'm open to 
                        freelance work, collaborations, or just a friendly chat.
                    </p>
                </div>
            </div>
            <div className="contact-right-panel">
                <div className="contact-form-container">
                    <h1>Send a Message</h1>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="What's this about?"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell me more about your project, idea, or just say hello..."
                                rows="6"
                                required
                            />
                        </div>
                        {status.message && (
                            <div className={`form-status ${status.type}`}>
                                {status.message}
                            </div>
                        )}
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}