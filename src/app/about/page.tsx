import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-center mb-8">
          About Safari Academy
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-12">
          Our mission is to make quality education accessible to everyone, everywhere.
        </p>
        <Image
          src="https://placehold.co/1200x500"
          alt="Our Team"
          width={1200}
          height={500}
          className="rounded-lg shadow-xl mb-12"
          data-ai-hint="diverse team working"
        />
        <div className="prose max-w-none text-foreground text-lg">
          <p>
            Safari Academy was founded on the principle that learning should be a lifelong adventure. We believe that education has the power to transform lives, open up new opportunities, and empower individuals to achieve their full potential.
          </p>
          <p>
            We partner with industry experts and passionate instructors to create high-quality, engaging online courses that are both informative and practical. Whether you're looking to start a new career, advance in your current one, or simply learn a new skill for personal enrichment, Safari Academy has something for you.
          </p>
          <p>
            Our platform is designed to be user-friendly and flexible, allowing you to learn at your own pace, on your own schedule. Join our global community of learners today and start your journey with us.
          </p>
        </div>
      </div>
    </div>
  );
}
