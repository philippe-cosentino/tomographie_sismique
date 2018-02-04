keyStr="";
for (i=48;i<(48+64);i++)
{
  keyStr=keyStr+String.fromCharCode(i);
}
//document.write (keyStr+"<br>");

function enc64(valeur)
{
	val1=valeur >>6;
	val2=(valeur&63);
	return keyStr[val1]+keyStr[val2];
}

function dec64(valeur)
{
	a1=valeur.charCodeAt(0);
	a2=valeur.charCodeAt(1);
	if (a1==33)
	{
	  c1=44;
	}
	else
	{
	  c1=a1-48;
	}
	if (a2==33)
	{
	  c2=44;
	}
	else
	{
	  c2=a2-48;
	}
	v=(c1<<6)|c2;
	return v;
}

function dec364(valeur)
{
	a1=valeur.charCodeAt(0);
	a2=valeur.charCodeAt(1);
	a3=valeur.charCodeAt(2);
	if (a1==33)
	{
	  c1=44;
	}
	else
	{
	  c1=a1-48;
	}
	if (a2==33)
	{
	  c2=44;
	}
	else
	{
	  c2=a2-48;
	}
	if (a3==33)
	{
	  c3=44;
	}
	else
	{
	  c3=a3-48;
	}
		
	v=Math.round((c1<<12)|(c2<<6)|c3);
	return v;
}