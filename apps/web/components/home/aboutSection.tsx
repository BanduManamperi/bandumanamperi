import Image from "next/image";

const AboutSection = () => {
    return (
        <section id="about" className="py-24 md:py-32 bg-background">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="order-2 md:order-1">
                        <p className="text-2xl font-bold mb-4">About</p>
                        <h2 className="text-6xl mb-8">The Artist</h2>
                        <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
                            <p>
                                <strong className="font-bold">Bandu Manamperi</strong> , an artist whose work transcends traditional boundaries to explore themes of identity, conflict, and the complexities of
                                human nature, has made a significant mark on the global art scene. His multifaceted approach to art, which incorporates performances, drawings,
                                and installations, challenges viewers to confront their perceptions and engage in a deeper dialogue with the subject matter. Drawing from his own experiences and cultural heritage, Manamperi&apos;s pieces offer a poignant reflection on the societal and personal impacts of political turmoil.


                            </p>
                            <p>
                                As a founding member and Vice Chairman of Theertha International Artists&apos; Collective in Sri Lanka, he has been pivotal in promoting contemporary art and fostering a community for artists to collaborate and express themselves freely. His art serves not only as
                                a mirror reflecting societal issues but also as a bridge connecting diverse audiences through the universal language of creativity and emotion. As an acclaimed figure in contemporary art,
                                Bandu Manamperi continues to inspire and provoke thought, cementing his place as a visionary artist whose work resonates across cultures and generations.
                            </p>
                        </div>

                        {/* <div className="mt-10 pt-8 border-t border-border">
                            <div className="grid grid-cols-3 gap-8 text-center">
                                <div>
                                    <p className="font-serif text-3xl text-foreground">15+</p>
                                    <p className="section-subtitle mt-1">Years</p>
                                </div>
                                <div>
                                    <p className="font-serif text-3xl text-foreground">40+</p>
                                    <p className="section-subtitle mt-1">Exhibitions</p>
                                </div>
                                <div>
                                    <p className="font-serif text-3xl text-foreground">12</p>
                                    <p className="section-subtitle mt-1">Countries</p>
                                </div>
                            </div>
                        </div> */}
                    </div>

                    <div className="order-1 md:order-2">
                        <div className="relative w-full h-full">
                            <div className="absolute -top-4 -left-4 w-full h-full border border-border" />
                            <Image
                                src="/IMG_8614.JPG"
                                alt="Bandu manamperi"
                                width={1000}
                                height={1000}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
