package <%- packageName %>.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class <%-targetName2 %>Model {
	<% columns.forEach(function(c){ %>
	<% if(c.name === 'id'){ %>
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)<% }%>
	private <%- c.javaType %> <%-c.name%>;<% }) %>

	<% columns.forEach(function(c){ %>
	public <%- c.javaType %> get<%-c.javaName%>() {
		return <%-c.name%>;
	}
	public void set<%-c.javaName%>(<%- c.javaType %> <%-c.name%>) {
		this.<%-c.name%> = <%-c.name%>;
	}
	<% }) %>
}
