function make_text_fit_in_box(self, string, box_size, font_size){
	font_size = font_size || 48;
	if(box_size instanceof Array)
		box_size = {width: box_size[0], height: box_size[1]};
	var lines,current_line;
	while(true){
		self.font=font_size+"px Impact";
		lines = [];
		current_line = [];
		var split_string = string.split(/\s/);
		while(split_string.length != 0){
			word = split_string[0];
			if(self.measureText(word).width > box_size.width){
				lines.push(split_string.shift());
				continue;
			}
			str = current_line.concat(word).join(" ");
			if(self.measureText(str).width < box_size.width){
				current_line.push(split_string.shift());
			}else{
				lines.push(current_line);
				current_line = [];
			}
		}
		lines.push(current_line);
		if(lines.length*font_size < box_size.height)
			break;
		font_size /= 2;
	}
	return [font_size, lines];
}
function draw_caption(self, lines, font_size){
	self.textAlign = "center";
	self.strokeStyle = "black";
	self.fillStyle="white";
	self.font = font_size+"px Impact";
	for(var i = 0; i < lines.length; i++){
		line = lines[i].join(" ");
		self.fillText(line, self.canvas.width/2, i*font_size+font_size);
		self.strokeText(line, self.canvas.width/2, i*font_size+font_size);
	}
	
}
if(!(typeof(window) !== 'undefined' && window === this))
module.exports= {
	make_text_fit_in_box: make_text_fit_in_box,
	draw_caption: draw_caption
};
