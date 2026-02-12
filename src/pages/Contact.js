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
        const WEB3FORMS_KEY = process.env.REACT_APP_WEB3FORMS_KEY;

        const payload = {
            access_key: WEB3FORMS_KEY,
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            from_name: "Ethan Tan's Portfolio",
            replyto: formData.email
        };

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Failed to send message");
        }

        setStatus({
            type: 'success',
            message: 'Thank you! Your message has been sent successfully.'
        });

        setFormData({ name: '', email: '', subject: '', message: '' });

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