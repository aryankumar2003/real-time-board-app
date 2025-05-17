"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Layout, Users, Layers, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full py-4 px-4 md:px-6 lg:px-8 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/80 backdrop-blur-md border-b' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center">
              <Layout className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">BoardFlow</span>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="hidden md:flex items-center gap-6"
          >
            {['Features', 'Pricing', 'Testimonials'].map((item) => (
              <motion.div key={item} variants={fadeIn}>
                <Link
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Desktop CTA Buttons */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="hidden md:flex items-center gap-4"
          >
            <motion.div variants={fadeIn}>
              <Link href="/">
                <Button variant="outline" size="sm" className="hover:scale-105 transition">
                  Dashboard
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Link href="/sign-up">
                <Button size="sm" className="hover:scale-105 transition">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-full left-0 right-0 bg-background border-b"
            >
              <div className="container mx-auto py-4 px-4">
                <div className="flex flex-col gap-4">
                  {['Features', 'Pricing', 'Testimonials'].map((item) => (
                    <Link
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-sm font-medium hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  ))}
                  <div className="flex flex-col gap-2 mt-4">
                    <Link href="/">
                      <Button variant="outline" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  staggerChildren: 0.2
                }
              }
            }}
            className="container mx-auto px-4 md:px-6 text-center"
          >
            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            >
              Collaborate and organize with{" "}
              <span className="text-primary">BoardFlow</span>
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
            >
              The ultimate visual workspace for teams to plan, collaborate, and bring your best ideas to life.
            </motion.p>

            <motion.div
              variants={stagger}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <motion.div variants={fadeIn}>
                <Link href="/">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto hover:scale-105 transition group"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Link href="#demo">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto hover:scale-105 transition"
                  >
                    View Demo
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="relative mx-auto max-w-5xl rounded-xl border bg-background shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src="/placeholder.svg?height=600&width=1200"
                width={1200}
                height={600}
                alt="BoardFlow Dashboard"
                className="w-full h-auto"
                priority
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Continue with other sections... */}

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="container mx-auto px-4 md:px-6"
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage projects, organize tasks, and collaborate with your team.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Layout className="h-6 w-6 text-primary" />,
                  title: "Interactive Boards",
                  description:
                    "Create visual boards to organize your thoughts, projects, and tasks in a flexible, intuitive interface.",
                },
                {
                  icon: <Users className="h-6 w-6 text-primary" />,
                  title: "Team Collaboration",
                  description:
                    "Work together in real-time with your team members, share ideas, and make decisions faster.",
                },
                {
                  icon: <Layers className="h-6 w-6 text-primary" />,
                  title: "Organization Management",
                  description:
                    "Manage multiple organizations and projects from a single dashboard with powerful organization tools.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.2 },
                    },
                  }}
                  className="bg-background p-8 rounded-xl border hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="container mx-auto px-4 md:px-6"
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that&apos;s right for you and your team.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {[
                {
                  title: "Free",
                  description: "For individuals and small teams",
                  price: "$0",
                  features: ["Up to 3 boards", "Basic collaboration", "1 organization"],
                },
                {
                  title: "Pro",
                  description: "For growing teams",
                  price: "$12",
                  popular: true,
                  features: [
                    "Unlimited boards",
                    "Advanced collaboration",
                    "Multiple organizations",
                    "Priority support",
                  ],
                },
                {
                  title: "Enterprise",
                  description: "For large organizations",
                  price: "Custom",
                  features: [
                    "Everything in Pro",
                    "SSO & advanced security",
                    "Dedicated support",
                    "Custom integrations",
                  ],
                },
              ].map((plan, index) => (
                <motion.div
                  key={plan.title}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.2 },
                    },
                  }}
                  className={`bg-background p-8 rounded-xl border relative 
                    ${plan.popular ? "border-primary shadow-lg" : ""}
                    hover:shadow-xl transition-all duration-300 hover:scale-105`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold">{plan.title}</h3>
                    <p className="text-muted-foreground mt-2">{plan.description}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className="text-muted-foreground">/month per user</span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full hover:scale-105 transition-transform"
                  >
                    {plan.title === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="py-20 bg-primary text-primary-foreground"
        >
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to get started?
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-xl opacity-90 max-w-2xl mx-auto mb-10"
            >
              Join thousands of teams already using BoardFlow to collaborate and bring their ideas to life.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Link href="/">
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:scale-105 transition-transform group"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-background/50 backdrop-blur-sm">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="container mx-auto px-4 md:px-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Footer sections... (Keep existing content but wrap in motion.div) */}
          </div>
          <motion.div
            variants={fadeIn}
            className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          >
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BoardFlow. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {["Terms", "Privacy", "Cookies"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </footer>

      {/* Scroll to top button */}
      <ScrollToTopButton />
    </div>
  );
}

// Add this component at the end of the file
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}