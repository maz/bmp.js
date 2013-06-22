this.BMP=(function(){
	//The following two functions are from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
	function uint6ToB64 (nUint6) {

	  return nUint6 < 26 ?
	      nUint6 + 65
	    : nUint6 < 52 ?
	      nUint6 + 71
	    : nUint6 < 62 ?
	      nUint6 - 4
	    : nUint6 === 62 ?
	      43
	    : nUint6 === 63 ?
	      47
	    :
	      65;

	}

	function base64EncArr (aBytes) {

	  var nMod3, sB64Enc = "";

	  for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
	    nMod3 = nIdx % 3;
	    if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) { sB64Enc += "\r\n"; }
	    nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
	    if (nMod3 === 2 || aBytes.length - nIdx === 1) {
	      sB64Enc += String.fromCharCode(uint6ToB64(nUint24 >>> 18 & 63), uint6ToB64(nUint24 >>> 12 & 63), uint6ToB64(nUint24 >>> 6 & 63), uint6ToB64(nUint24 & 63));
	      nUint24 = 0;
	    }
	  }

	  return sB64Enc.replace(/A(?=A$|$)/g, "=");

	}
	var header=new Uint8Array([
		0x42, 0x4D,
		0x00, 0x00, 0x00, 0x00,//Little endian Size of file
		0x00, 0x00, 0x00, 0x00,
		0x7A, 0x00, 0x00, 0x00,
		0x6C, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,//Little endian Width
		0x00, 0x00, 0x00, 0x00,//Little endian Height
		0x01, 0x00, 0x20, 0x00,
		0x03, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,//Little endian Size of Pixel Data
		0x13, 0x0B, 0x00, 0x00,
		0x13, 0x0B, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0xFF, 0x00,
		0x00, 0xFF, 0x00, 0x00,
		0xFF, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0xFF,
		0x42, 0x47, 0x52, 0x73,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00
	]);
	function BMP(w, h){
		//Note, we set the BMP to be in sRGB color space
		var pixel_sze=w*h;
		var sze=header.length+pixel_sze;
		this.data=new Uint8Array(sze);
		this.data.set(header);
		this.width=w;
		this.height=h;
		
		var view=new DataView(this.data.buffer);
		view.setInt32(0x02, sze, true);
		view.setInt32(0x12, w, true);
		view.setInt32(0x16, -1*h, true);
		view.setInt32(0x22, pixel_sze, true);
		this.pixels=this.data.subarray(header.length);
	}
	BMP.prototype.toBase64=function(){
		return base64EncArr(this.data);
	};
	BMP.prototype.toDataURL=function(){
		return "data:image/bmp;base64,"+this.toBase64();
	};
	
	return BMP;
})();