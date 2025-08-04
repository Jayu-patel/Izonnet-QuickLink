export default function Footer() {
    return (
        <div className='text-[#4B5563] mt-30'>
            <div>
                {/* section 1 */}
                <div className='mx-auto flex flex-col lg:flex-row gap-3 lg:gap-12 pt-10 pb-5'>
                    <div className='flex-3'>
                            <div className="mb-3 text-black">
                                <h1 onClick={()=>{navigate('/')}} className='text-3xl lg:text-4xl font-semibold cursor-pointer'>QuickClinic</h1>
                            </div>
                        <p className='text-[1.125rem] font-light py-3 w-[75%] lg:w-auto'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero rerum similique, expedita illum quidem error commodi aspernatur dolorem tempora. Sunt.
                        </p>

                    </div>

                    <div className='flex-1 py-10 lg:py-0'>
                        <h2 className='text-2xl font-semibold'>Company</h2>
                        <ul className='leading-8 pt-3 [&_li]:cursor-pointer'>
                            <li>About Us</li>
                            <li>Contact Us</li>
                            <li>Privacy & Policy</li>
                        </ul>
                    </div>

                    <div className='flex-1'>
                        <h2 className='text-2xl font-semibold'>Get In Touch</h2>
                        <ul className="leading-10 pt-3 [&_li]:cursor-pointer">
                            <li>+91 9912345678</li>
                            <li>info@quickclinic.com</li>
                        </ul>
                    </div>

                </div>

                {/* section 2 */}
                <div className='w-full border-[#D9D9D9] border-t-[0.5px] py-4 mt-4 flex justify-center text-center'>
                    <p className='text-[1.125rem] w-[80%] lg:w-auto'>Copyright © 2025 QuickClinic Design and Developed by Izonnet Web Solution Pvt. Ltd.</p>
                </div>
            </div>
        </div>
    )
}
