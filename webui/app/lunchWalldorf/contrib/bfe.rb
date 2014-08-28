#!/bin/ruby
require 'mechanize'
require  'pry'
require 'fileutils'
require 'time'
require 'pry'
require 'hpricot'
require 'json'

a = Mechanize.new
a.user_agent="Mozilla/5.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0"
a.set_proxy('proxy.wdf.sap.corp', '8080')
page = a.get("http://www.casinocatering.de/speiseplan/max-rubner-institut");
c = Hpricot.parse( a.page.content)

d = c.search("div[@class='item-list']")

# lunchmenue from http://app.sap.eurest.de/mobileajax/data/35785f54c4f0fddea47b6d553e41e987/all.json
# as blueprint :)
j = JSON.parse(File.new("lunchmenue_blank.json").read)

d.each_with_index do |tag,tindex|
	next if tindex == 0
	
	date = Date.parse(tag.search("//span").first.attributes["content"])
	e = tag.search("li/div/div/p")
	
	datestring = date.strftime("%s")

	jwd = {
		"weekDay"	=> date.strftime("%a").downcase,
		"date"		=> datestring,
		"counters"	=> []
		}
	
	skip = false
	e.each_with_index do |essen,eindex|
		
		next if essen.inner_html.match(/strong> "/)
		if essen.inner_html.match(/Suppe &amp/)
			skip = true
			next
		end
		if ! skip
			jwd["counters"].push(
				{"id"		=>(50+eindex).to_s+"_"+datestring,
				"title"		=>{"de"=>"Hauptgang "+(eindex+1).to_s, "en"=>"Main course"},
				"dishes"	=>
					[{"id"=>"2672"+(5+eindex).to_s,
						"title"=> 
						#	{"de"=>coder.encode(essen.inner_html,:named),
						##		"en"=>coder.encode(essen.inner_html,:named)},
						{"de"=>essen.inner_html,
							"en"=>essen.inner_html},
						"description"=>{"de"=>" ", "en"=>" "},
						"allowFeedback"=>false,
						"price"=>nil,
						"additives"=>[]}]},
				)
		else 
			jwd["counters"].push(
				{"id"=> (50+eindex).to_s+"_"+datestring,
				"title"=>{"de"=>"Suppe", "en"=>"Soup"},
				"dishes"=>
					[{"id"=>"26762",
						"title"=>
#							{"de"=>coder.encode(essen.inner_html,:named), 
#							"end"=>coder.encode(essen.inner_html,:named)},
						{"de"=>essen.inner_html,
							"en"=>essen.inner_html},
						"description"=>{"de"=>" ", "en"=>" "},
						"allowFeedback"=>false,
						"price"=>nil,
						"additives"=>[]}]}
				)
			break
		end
		
				
			
	end
	j["menu"].push(jwd)
	
end
file = File.new("bfe.json","w")
file.write(j.to_json)
file.close

