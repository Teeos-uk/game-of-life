window.onload = function() {
	var model = {
		init: function() {
			class Field {
				constructor(width, height) {
					this.width = width;
					this.height = height;
					this.cells = [];
					for (var i = 0; i < width; i++)
						this.cells[i] = [];
					this.random();
					
					this.offsets = [
					[-1, -1], [ 0, -1], [+1, -1],
					[-1,  0],           [+1,  0],
					[-1, +1], [ 0, +1], [+1, +1]];
				}
				
				clear() {
					for (var y = 0; y < this.height; y++)
						for (var x = 0; x < this.width; x++)
							this.cells[x][y] = 0;
				}

				random() {
					for (var y = 0; y < this.height; y++)
						for(var x = 0; x < this.width; x++)
							this.cells[x][y] = Math.floor(2*Math.random());
				}
				
				neighbours_around(x, y) {
					var neighbours_count = 0;
					for (var i in this.offsets) {
						var x_offset = (x + this.width  + this.offsets[i][0]) % this.width;
						var y_offset = (y + this.height + this.offsets[i][1]) % this.height;
						neighbours_count += this.cells[x_offset][y_offset];
					}
					return neighbours_count;
				}

				tick() {
					var updated_field = new Field(this.width, this.height);
					updated_field.clear();
					
					for (var y = 0; y < this.height; y++)
						for (var x = 0; x < this.width; x++) {
							var neighbours_count = this.neighbours_around(x, y);

							if (neighbours_count == 3)
								updated_field.cells[x][y] = 1;
							if (neighbours_count == 2 && this.cells[x][y] == 1)
								updated_field.cells[x][y] = 1;
						}


					this.cells = updated_field.cells;
				}
			}
			this.field = new Field(48, 16);
			this.timer_id = 0;
			this.isPlaying = false;
		},
	};
	
	var view = {
		init: function() {
			var tick_button = document.getElementById("tick");
			tick_button.addEventListener('click', controller.tick);
			var play_button = document.getElementById("play");
			play_button.addEventListener('click', controller.play);
			var stop_button = document.getElementById("stop");
			stop_button.addEventListener('click', controller.stop);
			var dt_slider = document.getElementById("dt_input");
			dt_slider.addEventListener('click', controller.slider_moved);
			var randomize_button = document.getElementById("randomize");
			randomize_button.addEventListener('click', controller.randomize)
		},

		update: function() {
			var field_table = document.getElementById("field");
			field_table.innerHTML = "";
			for (var y = 0; y < model.field.height; y++) {
				var row = document.createElement("tr");
				for (var x = 0; x < model.field.width; x++) {
					var cell = document.createElement("td");
					cell.innerHTML = model.field.neighbours_around(x, y);

					switch (model.field.cells[x][y]) {
						case 0: {
							cell.style.backgroundColor = "#FF851B";
							break;
						}
						case 1: {
							cell.style.backgroundColor = "#111";
						}
					}

					row.appendChild(cell);
				}
				field_table.appendChild(row);
			}
		},
	};

	var controller = {
		init: function() {
			model.init();
			view.init();
			view.update();
			//console.log(model.field.cells);
		},

		tick: function() {
			model.field.tick();
			view.update();
		},

		play: function() {
			var dt_slider = document.getElementById('dt_input');
			var dt = Number(dt_slider.value);
			model.timer_id = window.setInterval(controller.tick, dt);
			model.isPlaying = true;
		},

		stop: function() {
			window.clearTimeout(model.timer_id);
			model.isPlaying = false;
		},

		slider_moved: function() {
			var dt_slider = document.getElementById('dt_input');
			if (model.isPlaying) {
				controller.stop();
				controller.play();
			}
		},

		randomize: function() {
			model.field.random();
			view.update();
		},
	};
	controller.init();
}
