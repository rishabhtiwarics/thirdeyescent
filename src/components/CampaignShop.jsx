import React from "react";

// const campaignItems = [
//   { img: '/img/newsection/one.png', alt: 'Oud Noir Campaign', label: 'Oud Noir · ₹4,800' },
//   { img: '/img/newsection/three.png', alt: 'Rose Éternelle Campaign', label: 'Rose Éternelle · ₹5,200' },
//   { img: '/img/newsection/two.png', alt: 'Vetiver Blanc Campaign', label: 'Vetiver Blanc · ₹4,500' },
// ]

const campaignItems = [
	{
		img: "/img/prodimg/coming-soon.jpeg",
		alt: "Oud Noir Campaign",
		label: "Oud Noir · ₹4,800",
	},
	{
		img: "/img/prodimg/coming-soon.jpeg",
		alt: "Rose Éternelle Campaign",
		label: "Rose Éternelle · ₹5,200",
	},
	{
		img: "/img/prodimg/coming-soon.jpeg",
		alt: "Vetiver Blanc Campaign",
		label: "Vetiver Blanc · ₹4,500",
	},
];

export default function CampaignShop() {
	return (
		<section
			id="campaign-shop"
			className="relative py-16 pb-[72px] bg-white"
		>
			<div className="container mx-auto px-4">
				<div className="text-center mb-7">
					<p className="font-montserrat text-[10px] tracking-[.40em] uppercase mb-[6px] campaign-label-color">
						Fragrance Edit
					</p>
					<h2 className="font-cormorant font-light tracking-[.05em] text-[#1a1410] m-0 campaign-title">
						Shop the Campaign
					</h2>
				</div>

				<div className="grid grid-cols-3 gap-[18px] max-[992px]:gap-[14px] max-[768px]:grid-cols-1">
					{campaignItems.map((item, i) => (
						<div
							key={i}
							className="overflow-hidden transition-all duration-[350ms] hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(15,13,11,0.14)]"
						>
							<div
								className="relative w-full overflow-hidden campaign-img-bg"
								style={{ aspectRatio: "4/5" }}
							>
								<img
									src={item.img}
									alt={item.alt}
									className="w-full h-full object-cover object-top block animate-breath transition-transform duration-[750ms]"
								/>
							</div>
							<a
								href="#collection"
								className="campaign-btn-border relative flex items-center justify-center min-h-[58px] mt-[10px] overflow-hidden no-underline transition-all duration-[250ms] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(15,13,11,0.15)] group"
							>
								<span className="relative z-[1] font-montserrat text-[10px] font-medium tracking-[.2em] uppercase text-[#1a1410] group-hover:text-white transition-colors">
									{item.label}
								</span>
							</a>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
