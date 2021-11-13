
/**
 * Resize image to favicon size using canvas
 * @param {string} dataUrl
 * @param options
 * @param {number} [options.width] - 60
 * @param {number} [options.height] - 60
 * @returns {string}
 */
export function resizeFavicon(dataUrl: string, {width = 60, height = 60} :{
	width?: number;
	height?: number;
} = {}): Promise<string> {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');
		const img = new Image();
		img.onload = () => {
			ctx?.drawImage(img, 0, 0, width, height);
			const data = canvas.toDataURL('image/png');
			resolve(data);
		};
		img.onerror = (err) => {
			reject(err);
		}

		img.src = dataUrl;
	}) as Promise<string>;
}

/**
 * set favicon to page
 * @param {string} dataUrl
 * @returns {void}
 */
export function setFavicon(dataUrl: string): void {
	if(isFaviconSet()) {
		updateFavicon(dataUrl);
	}else{
		const link = document.createElement('link');
		link.rel = 'icon';
		link.href = dataUrl;
		document.head.appendChild(link);
	}
}

/**
 * update favicon
 * @param {string} dataUrl
 * @returns {void}
 */
export function updateFavicon(dataUrl: string): void {
	const link: HTMLAnchorElement | null = document.querySelector('link[rel="icon"]');
	if (link) {
		link.href = dataUrl;
	}
}

/**
 * check if favicon is set
 * @returns {boolean}
 */
export function isFaviconSet(): boolean {
	return !!document.querySelector('link[rel="icon"]');
}

/**
 * get favicon
 * @returns {string}
 */
export function getFavicon(): string {
	const link: HTMLAnchorElement | null = document.querySelector('link[rel="icon"]');
	return link?.href || '';
}
