
	let Deg2Rad = 0.0174532924; 
	var canvas = document.getElementById('cv_main');
	var ctx = canvas.getContext('2d');	
	var mAngle = new Array(4);
	var mInValue = -50;	
	var wh = 30;	
	var px =  wh - 15,py = wh - 15;
	var ex = new Array(4),ey = new Array(4);
	var eyeTop = 4;
	var eyeTopLength = 10;
	var eyeBottomLength = 5;
	var eyeLeft = 10;
	var blocks = new Array(27);
	var foods = [];
	
	var direction = 0, curdir = -1; //0 right,1 left, 2 up, 3 down
	var edirection = new Array(4);
	var espeed = 25; pspeed = 25;
	var enx = new Array(4),eny = new Array(4);
	var pnx = wh - 15,pny = wh - 15;
	var pCol = 0;
	var start = false;
		
	window.onload=function(){				
		canvas.height = wh*20+3;
		canvas.width = wh*20+3;
		
		mAngle[1] = 0;
		mAngle[0] = 0;
		mAngle[2] = 45;
		mAngle[3] = 45;
		
		canvasTimer=setInterval(update,17);		
		canvas.addEventListener("mouseup",function(e){			
			sel = 1;			
		});
		
		canvas.addEventListener("keydown",function(e){
				//alert(e.keyCode);
		switch(e.keyCode)
		{
			case 37: 
				curdir = 1; 
				if(!start) 
					start = true; 
			break;
			case 38:
				curdir = 2; 
				if(!start) 
					start = true; 
			break;
			case 39:
				curdir = 0; 
				if(!start) 
					start = true; 
			break;
			case 40:
				curdir = 3; 
				if(!start) 
					start = true; 
			break;
			default: break;
		}
		});	

		//ctx.fillStyle="black";
		
		<!-- ctx.beginPath(); -->
		<!-- ctx.beginPath(); -->
		<!-- startangle = -45 * Deg2Rad; -->
		<!-- endangle = -135 * Deg2Rad; -->
		<!-- ctx.arc(px, py, 13, startangle, endangle, false); -->
		<!-- ctx.lineTo(py, py+6); -->
		<!-- ctx.fill();		 -->
		ex[0] = wh * 4 - 15;
		ey[0] = wh * 4 - 15;
		enx[0] = wh * 4 - 15;
		eny[0] = wh * 3 - 15;
		edirection[0] = 2;
		
		ex[1] = wh * 16 - 15;
		ey[1] = wh - 15;
		enx[1] = wh * 16 - 15;
		eny[1] = wh * 2 - 15;
		edirection[1] = 3;
		
		ex[2] = wh * 16 - 15;
		ey[2] = wh * 20 - 15;
		enx[2] = wh * 16 - 15;
		eny[2] = wh * 19 - 15;
		edirection[2] = 2;
		
		ex[3] = wh * 7 - 15;
		ey[3] = wh * 20 - 15;
		enx[3] = wh * 8;
		eny[3] = wh * 20 - 15;
		edirection[3] = 0;
		
		drawPlayer(ctx,direction);
		drawBlocks(ctx);	
		
		var blockpos = "";
		
		for(i=0;i<27;i++)
		{
			var b = blocks[i];
			blockpos += "X : " + b.getX + " Y : " + b.getY + " W : " + b.getW + " H : " + b.getH + "\n"; 
		}
		console.log("===========");
		console.log(blockpos);
		console.log("===========");

		ctx.beginPath();
		ctx.fillStyle = "black";
		var i = 0;
		for(i=0;i<20;i++)
		{
			for(var j=0;j<20;j++)
			{
				bx = wh * i + 15;
				by = wh * j + 15;				
				iscontain = false;
				
				for(var k=0;k<27;k++)
				{
					let b = blocks[k];
					if((bx >= b.getX && bx <= b.getX + b.getW ) && 
						(by >= b.getY && by <= b.getY + b.getH))
					{
						iscontain = true;
						break;
					}
				}			
				
				if(!iscontain)
				{
					ctx.fillRect(bx-3,by-3,6,6);
					foods.push(new Food(bx-3,by-3,6,6,false));
				}
			}
		}
		ctx.fill();		
		drawEnemy(ctx);	
	}
	
	function update(){
		<!-- if( curdir !== -1){ -->
			<!-- if( curdir !== direction && CheckCanMove(curdir)) -->
			<!-- { -->
				<!-- direction = curdir; -->
				<!-- curdir = -1; -->
			<!-- }			 -->
		<!-- } -->
		
		PlayerMovement();
		EnemyMovement();
		CheckPoints();
		CheckGameOver();
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,wh * 20 + 3,wh * 20 + 3);
		ctx.clearRect(1,1,wh * 20,wh * 20);
		ctx.fill();
		if(pCol != foods.length)
			drawPoints(ctx);
		drawPlayer(ctx,direction);
		drawBlocks(ctx);
		drawEnemy(ctx);
		
		if(pCol == foods.length)
		{
			alert("You win....");
			clearInterval(canvasTimer);
		}
	}
	
	function CheckGameOver(){
		var GameOver = false;
		for(k=0;k<4;k++)
		{
		if(ex[k] < px && ey[k] == py)
		{
			if(px - 13 <= ex[k] + 13)
			{
				GameOver = true;
				break;
			}
		}
		else if(ex[k] > px && ey[k] == py)
		{
			if(px+13 >= ex[k] - 13)
			{
				GameOver = true;
				break;
			}
		}
		else if(ey[k] > py && ex[k] == px)
		{
			if(ey[k] - 13 <= py + 13)
			{
				GameOver = true;				break;

			}
		}
		else if(ey[k] < py && ex[k] == px)
		{
			if(ey[k] + 13 >= py - 13)
			{
				GameOver = true;				break;
			}
		}
		}
		
		if(GameOver)
		{
			alert("It's Game Over");
			clearInterval(canvasTimer);
		}
	}
	
	function CheckPoints(){
		for(i=0;i<foods.length;i++)
		{
			var f = foods[i];
			if(f.getDel == true)
				continue;
			//console.log("checking.... " + i);	
			if((f.getX  >= px - 13 && f.getX + f.getW <= px + 13) 
				&& (f.getY > py - 13 && f.getY + f.getW <= py + 13))
			{
				f.setDel = true;
				pCol++;
				console.log("Collected : " + f.getX + " " + f.getY);
				break;
			}
		}
	}
	
	function CheckCanMove(dir){
		var canmove = true;
		switch(dir){
			case 0:
				if(pnx + 30 <= wh * 20)
				{
					for(i = 0; i < 27;i++)
					{
						var b = blocks[i];
						if(b.getX < pnx + 30)
							continue;
						if(b.getX <= pnx + 30 && pny >= b.getY && pny <= b.getY + b.getH)
						{
							//console.log("Can't Move to right : X : " + b.getX + " Y : " + b.getY + " W : " + b.getW + " H : " + b.getH);
							canmove = false;
							break;
						}
					}
				}
				else 
				{
					canmove = false;
				}
			break;
			case 1:
				if(pnx - 30 >= 15)
				{
					for(i = 0; i < 27;i++)
					{
						var b = blocks[i];
						if(b.getX > pnx - 30)
							continue;
						if(b.getX + b.getW >= pnx - 30 && pny >= b.getY && pny <= b.getY + b.getH)
						{
							//console.log("Can't Move to left : X : " + b.getX + " Y : " + b.getY + " W : " + b.getW + " H : " + b.getH);
							canmove = false;
							break;
						}
					}	
				}
				else 
				{
					canmove= false;
				}
			break;
			case 2:
				if(pny - 30 >= 15)
				{
					for(i = 0; i < 27;i++)
					{
						var b = blocks[i];
						if(b.getY > pny - 30)
							continue;
						if( pny - 30 <= b.getY + b.getH && pnx >= b.getX && pnx <= b.getX + b.getW)
						{
							//console.log("Can't Move to up : X : " + b.getX + " Y : " + b.getY + " W : " + b.getW + " H : " + b.getH);
							canmove = false;
							break;
						}
					}
				}
				else 
				{
					canmove= false;
				}
			break;
			case 3:
				if(pny + 30 <= wh * 20)
				{
					for(i = 0; i < 27;i++)
					{
						var b = blocks[i];
						if(b.getY < pny + 30)
							continue;
						if(b.getY <= pny + 30 && pnx >= b.getX && pnx <= b.getX + b.getW)
						{
							//console.log("Can't Move to down : X : " + b.getX + " Y : " + b.getY + " W : " + b.getW + " H : " + b.getH);	
							canmove = false;
							break;
						}
					}
				}
				else 
				{
					canmove= false;
				}
			break;
		}	
		return canmove;
	}
	
	function PlayerMovement(){
		if(start)
		{
			var canmove = true;			
			if(px == pnx && py == pny){	
				//console.log("Curser is here");
				var d= -1;
				if(curdir !== -1){
					d = curdir;
					curdir = -1;
				}
				else 
					d = direction;
					
				//console.log("D is : " + d);
				switch(d)
				{
					case 0:
						if(px + 30 < wh * 20)
						{
							for(i = 0; i < 27;i++)
							{
								var b = blocks[i];
								if(b.getX < px)
									continue;
								if(b.getX <= px + 30 && py >= b.getY && py <= b.getY + b.getH)
								{
									//console.log("Can't Move to right : X : " + b.getX + " Y : " + b.getY + " W : " + b.getW + " H : " + b.getH);
									canmove = false;
									break;
								}
							}
						}
						else 
						{
							canmove = false;
						}
					break;
					case 1:
						if(px - 30 >= 15)
						{
							for(i = 0; i < 27;i++)
							{
								var b = blocks[i];
								if(b.getX > px)
									continue;
								if(b.getX + b.getW >= px - 30 && py >= b.getY && py <= b.getY + b.getH)
								{
									a = i;
									//console.log("Can't Move to left : X : " + b.getX + " Y : " + b.getY + " W : " + b.getW + " H : " + b.getH);
									canmove = false;
									break;
								}
							}	
						}
						else 
						{
							canmove= false;
						}
					break;
					case 2:
						if(py - 30 >= 15)
						{
							for(i = 0; i < 27;i++)
							{
								var b = blocks[i];
								if(b.getY > py)
									continue;
								if( py - 30 <= b.getY + b.getH && px >= b.getX && px <= b.getX + b.getW)
								{
									a = i;
									//console.log("Can't Move to up : X : " + b.getX + " Y : " + b.getY + " W : " + b.getW + " H : " + b.getH);
									canmove = false;
									break;
								}
							}
						}
						else 
						{
							canmove= false;
						}
					break;
					case 3:
						if(py + 30 < wh * 20)
						{
							for(i = 0; i < 27;i++)
							{
								var b = blocks[i];
								if(b.getY < py)
									continue;
								if(b.getY <= py + 30 && px >= b.getX && px <= b.getX + b.getW)
								{
									a = i;
									//console.log("Can't Move to down : X : " + b.getX + " Y : " + b.getY + " W : " + b.getW + " H : " + b.getH);	
									canmove = false;
									break;
								}
							}
						}
						else 
						{
							canmove= false;
						}
					break;
					default: break;
				}
				
				if(canmove)
				{
					direction = d;
					if(direction == 0)
					{
						pnx = px + 30;
					}
					else if(direction == 1)
					{
						pnx = px - 30;

					}
					else if(direction == 2)
					{
						pny = py - 30;
				
					}
					else if(direction == 3)
					{
						pny = py + 30;	
					}
				}
			}

			if(direction == 0 && canmove)
			{
				px += pspeed * 0.059;
				if(Math.abs(px-pnx) < 1.475)
				{
					px = pnx;
				}
			}
			else if(direction == 1 && canmove)
			{
				px -= pspeed * 0.059;
				if(Math.abs(px-pnx) < 1.475)
				{
					px = pnx;
				}
			}
			else if(direction == 2 && canmove)
			{
				py -= pspeed * 0.059;
				if(Math.abs(py-pny) < 1.475)
				{
					py = pny;
				}					
			}
			else if(direction == 3 && canmove)
			{
				py += pspeed * 0.059;
				if(Math.abs(py-pny) < 1.475)
				{
					py = pny;
				}	
			}
		}
	}
	
	function EnemyMovement(){		
		if(start){		
			for(k = 0; k < 4;k++)
			{
				if(enx[k] == ex[k] && eny[k] == ey[k])
				{
					var canmove = true;
					var d = [];
					if(ex[k] + 30 <= wh * 20){
						for(i = 0; i < 27;i++)
						{
							var b = blocks[i];
							if(b.getX < ex[k])
								continue;
							if(b.getX <= ex[k] + 30 && ey[k] >= b.getY && ey[k] <= b.getY + b.getH)
							{
								//console.log("Can't Move to right : X : " + b.getX + " Y : " + b.getY + " W : " + b.getW + " H : " + b.getH);
								canmove = false;
								break;
							}
						}	
					}
					else 
					{
						canmove= false;
					}	

					if(canmove)
					d.push(0);

					canmove = true;
					if(ex[k] - 30 >= 15)
					{
						for(i = 0; i < 27;i++)
						{
							var b = blocks[i];
							if(b.getX > ex[k])
								continue;
							if(b.getX + b.getW >= ex[k] - 30 && ey[k] >= b.getY && ey[k] <= b.getY + b.getH)
							{
								//console.log("Can't Move to left : X : " + b.getX + " Y : " + b.getY + " W : " + b.getW + " H : " + b.getH);
								canmove = false;
								break;
							}
						}	
					}
					else 
					{
						canmove= false;
					}
					if(canmove)
					d.push(1);
					canmove = true;
					
					if(ey[k] - 30 >= 15)
					{
						for(i = 0; i < 27;i++)
						{
							var b = blocks[i];
							if(b.getY > ey[k])
								continue;
							if(ey[k] - 30 <= b.getY + b.getH && ex[k] >= b.getX && ex[k] <= b.getX + b.getW)
							{
								//console.log("Can't Move to up : X : " + b.getX + " Y : " + b.getY + " W : " + b.getW + " H : " + b.getH);

								canmove = false;
								break;
							}
						}
					}
					else 
					{
						canmove= false;
					}
					if(canmove)
					d.push(2);			
					canmove = true;
					
					if(ey[k] + 30 <= wh * 20)
					{
						for(i = 0; i < 27;i++)
						{
							var b = blocks[i];
							if(b.getY < ey[k])
								continue;
							if(b.getY <= ey[k] + 30 && ex[k] >= b.getX && ex[k] <= b.getX + b.getW)
							{
								//console.log("Can't Move to down : X : " + b.getX + " Y : " + b.getY + " W : " + b.getW + " H : " + b.getH);	
								canmove = false;
								break;
							}
						}
					}
					else 
					{
						canmove= false;
					}
					
					if(canmove)
					d.push(3);
					
					var s = Math.floor(Math.random() * (d.length));
					//console.log("Random no : " + s);
					edirection[k] = d[s];
					//console.log("E Dir : " + edirection);
					if(edirection[k] == 0)
					{
						enx[k] = ex[k] + 30;
						ex[k] += espeed * 0.059;		
					}
					else if(edirection[k] == 1)
					{
						enx[k] = ex[k] - 30;
						ex[k] -= espeed * 0.059;
					}
					else if(edirection[k] == 2)
					{
						eny[k] = ey[k] - 30;
						ey[k] -= espeed * 0.059;
					}
					else if(edirection[k] == 3)
					{
						eny[k] = ey[k] + 30;
						ey[k] += espeed * 0.059;
					}
					//console.log("Next ex 1: " + enx + " Next ey 1: " + eny);
				}
				else
				{
					if(edirection[k] == 0)
					{
						ex[k] += espeed * 0.059;
						if(Math.abs(ex[k]-enx[k]) < 1.475)
						{
							ex[k] = enx[k];
						}				
					}
					else if(edirection[k] == 1)
					{
						ex[k] -= espeed * 0.059;
						if(Math.abs(ex[k]-enx[k]) < 1.475)
						{
							ex[k] = enx[k];
						}
					}
					else if(edirection[k] == 2)
					{
						ey[k] -= espeed * 0.059;
						if(Math.abs(ey[k] - eny[k]) < 1.475)
						{
							ey[k] = eny[k];
						}
					}
					else if(edirection[k] == 3)
					{
						ey[k] += espeed * 0.059;
						if(Math.abs(ey[k] - eny[k])<1.475)
						{
							ey[k] = eny[k];
						}
					}	
					//console.log("Next ex : " + enx + " Next ey : " + eny);
					//console.log("Current Ex : " + ex + " Current ey : " + ey);
				}	
			}
		}		
	}
	
	function drawPlayer(ctx,dir){
		if(dir == 0){
			mAngle[0] += mInValue * 0.059; 
			//console.log("mAngle at 0 : " + mAngle[0]);
			if(mAngle[0] <= 1)
			{
				mAngle[0] = 1;
				mInValue = -mInValue;
			}
			else if(mAngle[0] >= 45)
			{
				mAngle[0] = 45;
				mInValue = -mInValue;
			}
			ctx.beginPath();
			startangle = mAngle[0] * Deg2Rad;
			endangle = -mAngle[0] * Deg2Rad;
			ctx.arc(px, py, 13, startangle, endangle, false);
			ctx.lineTo(px-6, py);
			ctx.fill();		
		}
		else if(dir == 1){
			mAngle[1] += mInValue * 0.059; 
			//console.log("mAngle at 1 : " + mAngle[1] + "mInValue : " + mInValue);
			if(mAngle[1] <= 135)
			{
				mAngle[1] = 135;
				mInValue = -mInValue;
			}
			else if(mAngle[1] >= 179)
			{
				mAngle[1] = 179;
				mInValue = -mInValue;
			}
			
			ctx.beginPath();
			startangle = mAngle[1] * Deg2Rad;
			endangle = -mAngle[1] * Deg2Rad;
			ctx.arc(px, py, 13, startangle, endangle, true);
			ctx.lineTo(px+6, py);
			ctx.fill();	
		}
		else if(dir == 3){
			mAngle[3] += mInValue * 0.059; 
			//console.log("mAngle at 3 : " + mAngle[3] + "mInValue : " + mInValue);
			if(mAngle[3] >= 45)
			{
				mAngle[3] = 45;
				mInValue = -mInValue;
			}
			else if(mAngle[3] <= 1)
			{
				mAngle[3] = 1;
				mInValue = -mInValue;
			}
			
			ctx.beginPath();
			startangle = (90 - mAngle[3]) * Deg2Rad;
			endangle = (90 + mAngle[3]) * Deg2Rad;
			//console.log("Start : " + startangle, " End : " + endangle);
			ctx.arc(px, py, 13, startangle, endangle, true);
			ctx.lineTo(px, py-6);
			ctx.fill();	
		}
		else if(dir == 2){
			mAngle[2] += mInValue * 0.059; 
			//console.log("mAngle at 2 : " + mAngle[2] + "mInValue : " + mInValue);
			if(mAngle[2] >= 45)
			{
				mAngle[2] = 45;
				mInValue = -mInValue;
			}
			else if(mAngle[2] <= 1)
			{
				mAngle[2] = 1;
				mInValue = -mInValue;
			}
			
			ctx.beginPath();
			startangle = (-90 - mAngle[2]) * Deg2Rad;
			endangle = (-90 + mAngle[2]) * Deg2Rad;
			//console.log("Start : " + startangle, " End : " + endangle);
			ctx.arc(px, py, 13, startangle, endangle, true);
			ctx.lineTo(px, py+6);
			ctx.fill();	
		}
	}
	
	function drawPoints(ctx){
		ctx.beginPath();
		ctx.fillStyle = "black";
		for(i = 0;i < foods.length;i++)
		{
			var f = foods[i];
			if(f.getDel == false)
			{
				ctx.fillRect(f.getX,f.getY,6,6);
			}
		}
		ctx.fill();
	}
	
	function drawBlocks(ctx){
		roundedRect(ctx,wh,wh * 1,wh * 2,wh * 1,5);
		blocks[0] = new Block(wh,wh * 1,wh * 2,wh * 1);
		
		roundedRect(ctx, wh * 4,wh * 1,wh * 3,wh * 2,5);
		blocks[1] = 
		       new Block(wh * 4,wh * 1,wh * 3,wh * 2);
		
		roundedRect(ctx,wh * 8,wh * 1,wh,wh * 4,5);
		blocks[2] = new Block(wh * 8,wh * 1,wh,wh * 4);
		
		roundedRect(ctx,wh * 10,wh * 1,wh,wh,5);
		blocks[3] = new Block(wh * 10,wh * 1,wh,wh);
		
 		roundedRect(ctx,wh,wh * 3,wh * 2,wh * 1,5);
		blocks[4]= new Block(wh,wh * 3,wh * 2,wh * 1);
		
		roundedRect(ctx,wh,wh * 5,wh * 3,wh * 2,5);
		blocks[5] = new Block(wh,wh * 5,wh * 3,wh * 2);
		
		roundedRect(ctx,wh * 5,wh * 4,wh * 2,wh*3,5);
		blocks[6] = new Block(wh * 5,wh * 4,wh * 2,wh*3);
		
		roundedRect(ctx,wh, wh*8,wh * 2,wh * 2,5);
		blocks[7] = new Block(wh, wh*8,wh * 2,wh * 2);
		
		roundedRect(ctx,wh * 12,wh,wh * 3,wh * 2,5);
		blocks[8] = new Block(wh * 12,wh,wh * 3,wh * 2);
		
		roundedRect(ctx,wh * 16,wh * 5,wh * 3,wh * 4,5);
		blocks[9] = new Block(wh * 16,wh * 5,wh * 3,wh * 4);
		
		roundedRect(ctx,wh * 16,wh,wh * 3,wh * 3,5);
		blocks[10] = new Block(wh * 16,wh,wh * 3,wh * 3);
		
		roundedRect(ctx,wh * 7,wh * 16,wh * 3,wh*3,5);
		blocks[11] = new Block(wh * 7,wh * 16,wh * 3,wh*3);
		
		roundedRect(ctx,wh * 11,wh * 16,wh * 4,wh * 3,5);
		blocks[12] = new Block(wh * 11,wh * 16,wh * 4,wh*3);
		
		roundedRect(ctx,wh,wh * 16,wh * 5,wh * 3,5);
		blocks[13] = new Block(wh,wh * 16,wh * 5,wh * 3);
		
		roundedRect(ctx,wh * 10,wh * 3,wh,wh * 4,5);
		blocks[14] = new Block(wh * 10,wh * 3,wh,wh * 4);
		
		roundedRect(ctx,wh * 8,wh * 6,wh,wh,5);
		blocks[15] = new Block(wh * 8,wh * 6,wh,wh);
		
		roundedRect(ctx,wh * 4,wh * 8,wh * 7,wh * 3,5);
		blocks[16] = new Block(wh * 4,wh * 8,wh * 7,wh * 3);
		
		roundedRect(ctx,wh * 12,wh * 4,wh * 3,wh * 3,5);
		blocks[17] = new Block(wh * 12,wh * 4,wh * 3,wh * 3);
		
		roundedRect(ctx,wh * 12,wh * 8,wh * 3,wh,5);
		blocks[18] = new Block(wh * 12,wh * 8,wh * 3,wh);	

		roundedRect(ctx,wh,wh * 11,wh * 2,wh *4,5);
		blocks[19] = new Block(wh,wh * 11,wh * 2,wh * 4);	
		
		roundedRect(ctx,wh * 4,wh * 12,wh * 4,wh * 3 ,5);
		blocks[20] = new Block(wh * 4,wh * 12,wh * 4,wh * 3);	
		
		roundedRect(ctx,wh * 12,wh * 10,wh * 3,wh * 4 ,5);
		blocks[21] = new Block(wh * 12,wh * 10,wh * 3,wh * 4);	
		
		roundedRect(ctx,wh * 9,wh * 12,wh * 2,wh * 3 ,5);
		blocks[22] = new Block(wh * 9,wh * 12,wh * 2,wh * 3);
		
		roundedRect(ctx,wh * 16,wh * 10,wh * 3,wh,5);
		blocks[23] = new Block(wh * 16,wh * 10,wh * 3,wh);
		
		roundedRect(ctx,wh * 16,wh * 12,wh * 3,wh*3,5);
		blocks[24] = new Block(wh * 16,wh * 12,wh * 3,wh*3);
		
		roundedRect(ctx,wh * 16,wh * 16,wh * 3,wh,5);
		blocks[25] = new Block(wh * 16,wh * 16,wh * 3,wh);
		
		roundedRect(ctx,wh * 16,wh * 18,wh * 3,wh,5);
		blocks[26] = new Block(wh * 16,wh * 18,wh * 3,wh);
	}

	function drawEnemy(ctx){
		for(k=0;k<4;k++)
		{
			ctx.beginPath();
			ctx.moveTo(ex[k] - 13, ey[k] - 5);
			sangle = 0;
			eangle = (Math.PI/180)*180;
			ctx.arc(ex[k],ey[k]-5,13,sangle,eangle,true);
			ctx.moveTo(ex[k] + 13,ey[k] - 5);
			ctx.lineTo(ex[k] + 13,ey[k] + 13)
			ctx.lineTo(ex[k] + 13 - 4.33,ey[k] + 13-5);
			ctx.lineTo(ex[k] + 13 - 4.33 * 2,ey[k] + 13);
			ctx.lineTo(ex[k],ey[k] + 13-5);
			ctx.lineTo(ex[k] - 4.33,ey[k] + 13);
			ctx.lineTo(ex[k] - 4.33 * 2,ey[k] + 13 - 5);
			ctx.lineTo(ex[k] - 13,ey[k] + 13);
			ctx.lineTo(ex[k] - 13,ey[k] - 5);		
			ctx.fill();
			
			ctx.fillStyle = "white";
			ctx.beginPath();
			ctx.moveTo(ex[k]-eyeLeft,ey[k]-eyeTop);
			ctx.bezierCurveTo(ex[k]-eyeLeft,ey[k]-eyeTopLength,ex[k]-1,ey[k]-eyeTopLength,ex[k]-1,ey[k]-eyeTop);
			ctx.moveTo(ex[k]-eyeLeft,ey[k]-eyeTop);
			ctx.bezierCurveTo(ex[k]-eyeLeft,ey[k]+eyeBottomLength,ex[k]-1,ey[k]+eyeBottomLength,ex[k]-1,ey[k]-eyeTop);		
			ctx.moveTo(ex[k]+eyeLeft,ey[k]-eyeTop);
			ctx.bezierCurveTo(ex[k]+eyeLeft,ey[k]-eyeTopLength,ex[k]+1,ey[k]-eyeTopLength,ex[k]+1,ey[k]-eyeTop);
			ctx.moveTo(ex[k]+eyeLeft,ey[k]-eyeTop);
			ctx.bezierCurveTo(ex[k]+eyeLeft,ey[k]+eyeBottomLength,ex[k]+1,ey[k]+eyeBottomLength,ex[k]+1,ey[k]-eyeTop);
			ctx.fill();
			
			ctx.fillStyle = "black";
			ctx.beginPath();
			ctx.arc(ex[k]-8,ey[k]-1,2,0,Math.PI * 2,true);
			ctx.fill();
			
			ctx.beginPath();
			ctx.arc(ex[k]+3,ey[k]-1,2,0,Math.PI*2,true);
			ctx.fill();
		}
	}
	
	function roundedRect(ctx, x, y, width, height, radius) {
		
	  ctx.beginPath();
	  ctx.moveTo(x, y + radius);
	  ctx.lineTo(x, y + height - radius);
	  ctx.arcTo(x, y + height, x + radius, y + height, radius);
	  ctx.lineTo(x + width - radius, y + height);
	  ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
	  ctx.lineTo(x + width, y + radius);
	  ctx.arcTo(x + width, y, x + width - radius, y, radius);
	  ctx.lineTo(x + radius, y);
	  ctx.arcTo(x, y, x, y + radius, radius);
	  ctx.stroke();
	}
	
	class Block{
		constructor(x,y,w,h)
		{
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
		}
		
		get getX(){return this.x;}
		get getY(){return this.y;}
		get getW(){return this.w;}
		get getH(){return this.h;}
	}
	
	class Food{
		constructor(x,y,w,h,isdel)
		{
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.Deleted = isdel;
		}
		
		get getX(){return this.x;}
		get getY(){return this.y;}
		get getW(){return this.w;}
		get getH(){return this.h;}
		
		get getDel(){return this.Deleted;}
		set setDel(value){this.Deleted = value;}
	}