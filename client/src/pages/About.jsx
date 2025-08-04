export default function About() {
    return (
        <div className="text-[#4B5563] md:mb-44 mt-10">
            <div className="w-full text-center my-5">
                <h1 className="mx-auto font-normal text-2xl md:text-3xl">ABOUT <span className="text-[#1F2937]">US</span></h1>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-10">
                <div>
                    <img className="w-full max-w-[360px] mx-auto sm:mx-0" src="/about_us.jpg" alt="" />
                </div>
                <div className="flex-2">
                    <p>Welcome to QuickClinic, your trusted partner in managing your healthcare needs conveniently and efficiently. At QuickClinic, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
                    <p className="py-7">QuickClinic is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, QuickClinic is here to support you every step of the way.</p>
                    <h3 className="pb-4">Our Vision</h3>
                    <p>Our vision at QuickClinic is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
                </div>
            </div>
        </div>
    )
}
