import React from 'react';
import Banner from '../components/Home/Banner';
import Hero from '../components/Home/Hero';
import FeatureSection from '../components/Home/FeatureSection';
import Badge from '../components/Home/Badge';
import Title from '../components/Home/Title';
import TestimonialTitle from '../components/Home/TestimonialTitle';
import Testimonial from '../components/Home/Testimonial';
import Footer from '../components/Home/Footer';
import TestimonialBanner from '../components/Home/TestimonialBanner';
import Action from '../components/Home/Action';

const Home = () => {
  return (
    <div>
      <Banner />
      <Hero />
      <Badge />
      <Title 
        title='Build Your Resume' 
        description='Our streamlined process helps you create a professional resume in minutes with intelligent AI-powered tools and features.' 
      />
      <FeatureSection />
      <TestimonialBanner />
      <TestimonialTitle 
        testimonialtitle="Don't just take our words" 
        testimonialdescription="Hear what our users say about us. We're always looking for ways to improve. If you have a positive experience with us, leave a review." 
      />
      <Testimonial />
      <Action />
      <Footer />
    </div>
  );
}

export default Home;
