import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611077544837-7c49f82d2c18?q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-custom-parchment/80 to-custom-parchment/20"></div>
        
        <div className="relative z-10 max-w-4xl mt-12">
          <h2 className="font-serif text-4xl md:text-5xl text-custom-forest font-bold mb-4 drop-shadow-sm">
            OUR STORY
          </h2>
          <p className="text-xl text-custom-charcoal/80 font-serif italic">
            Generations of dedication to the wood.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 -mt-10 relative z-20">
        <div className="bg-custom-cream rounded-xl shadow-xl shadow-custom-forest/5 p-8 md:p-16 border border-white/50">
          
          <div className="prose prose-lg prose-amber mx-auto">
            <h3 className="font-serif text-3xl text-custom-forest mb-6 text-center">From Kazanlak with Love</h3>
            <p className="text-custom-charcoal/80 leading-relaxed mb-6">
              Nestled in the heart of the Rose Valley, our family workshop in Kazanlak has been shaping wood into art for over three generations. What started as a small endeavor by our grandfather carving simple spoons and bowls, has blossomed into a lifelong dedication to preserving the intricate, spiritual art of Bulgarian woodcarving.
            </p>
            <p className="text-custom-charcoal/80 leading-relaxed mb-6">
              We specialize in Orthodox Christian iconography, breathing life and reverence into every piece of walnut, oak, and linden we touch. Each stroke of the chisel is guided by centuries of tradition, yet crafted with a distinct, modern precision that ensures our pieces stand the test of time.
            </p>
            <div className="my-12 border-l-4 border-custom-gold pl-6 py-2">
              <p className="text-xl font-serif text-custom-forest italic m-0">
                "Wood is alive. Our job is not to force it into a shape, but to reveal the story it already holds within its grain."
              </p>
            </div>
            <p className="text-custom-charcoal/80 leading-relaxed mb-6">
              Because true art cannot be rushed, many of our pieces are <strong>Made to Order</strong>. This allows us to pour our complete focus into your specific commission, offering deep personalization such as custom engravings on the back of our plaques and icons.
            </p>
            <p className="text-custom-charcoal/80 leading-relaxed">
              When you purchase from us, you aren't just buying decor. You are taking home a piece of Bulgarian heritage, crafted with patience, reverence, and an unwavering commitment to quality.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
