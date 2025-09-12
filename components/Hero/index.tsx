import Link from "next/link";

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="relative z-10 overflow-hidden pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
        style={{
          backgroundImage: 'url("/images/hero/hero.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div
                className="wow fadeInUp relative z-10 mx-auto max-w-[800px] text-center"
                data-wow-delay=".2s"
              >
                <h1 className="mb-5 text-3xl font-bold leading-tight text-white drop-shadow sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                  Empowering Your Digital Vision
                </h1>
                <p className="mb-12 text-base !leading-relaxed text-white/90 sm:text-lg md:text-xl">
                  At Netcurion Tech Pvt. Ltd., we turn your ideas into reality with
                  innovative web solutions. Our team of expert developers and
                  designers craft responsive, high-performance websites that
                  drive engagement and deliver results. From concept to launch,
                  we ensure a seamless journey, providing cutting-edge
                  technologies and customized strategies to elevate your online
                  presence. Partner with us to experience the future of web
                  development.
                </p>
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  {/* Add your buttons or other elements here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
