package <%- packageName %>.resource;

import java.net.URI;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.enterprise.context.RequestScoped;
import javax.inject.Named;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import <%- packageName %>.model.<%- targetName2 %>Model;

@Path("<%- targetName %>")
@Produces(MediaType.APPLICATION_JSON)
@RequestScoped
@Named
public class <%- targetName2 %>Resource {
	
	@PersistenceContext
	private EntityManager em;

	public static class <%- targetName2 %>Condition{
		<% columns.forEach(function(c){ %>
		@QueryParam("<%- c.name %>")
		private <%- c.javaType %> <%- c.name %>;
		<% }) %>
		<% columns.forEach(function(c){ %>
		public <%- c.javaType %> get<%- c.javaName %>() {
			return <%- c.name %>;
		}

		public void set<%- c.javaName %>(<%- c.javaType %> <%- c.name %>) {
			this.<%- c.name %> = <%- c.name %>;
		}
		<% }) %>
	}

	@GET
	public List<<%- targetName2 %>Model> search(@BeanParam <%- targetName2 %>Condition condition){
		Map<String,Object> params = new LinkedHashMap<>();
		List<String> conditions = new ArrayList<>();

		//量産型検索条件たち
		<% columns.forEach(function(c){ %>
		<% if(c.javaType === 'String'){ %>
		if(condition.get<%-c.javaName%>() != null && !condition.get<%-c.javaName%>().isEmpty()){
		<% }else{ %>
		if(condition.get<%-c.javaName%>() != null){
		<% } %>
			conditions.add("s.<%-c.name%> = :<%-c.name%>");
			params.put("<%-c.name%>", condition.get<%-c.javaName%>());
		}
		<% }) %>

		String jpql = "select s from <%-targetName2%>Model s";
		String where = conditions.stream().collect(Collectors.joining(" and "));
		if(!where.isEmpty()){
			jpql = jpql + " where " + where;
		}

		TypedQuery<<%-targetName2%>Model> q = em.createQuery(jpql,<%-targetName2%>Model.class);
		params.entrySet().forEach(e -> q.setParameter(e.getKey(), e.getValue()));
		return q.getResultList();
	}
	
	@GET
	@Path("{id}")
	public <%- targetName2 %>Model find(@PathParam("id") Long id){
		return em.find(<%- targetName2 %>Model.class, id);
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Transactional
	public Response create(@Valid <%- targetName2 %>Model model){
		em.persist(model);
		return Response.created(URI.create(model.getId().toString())).build();
	}
	
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Transactional
	public Response save(@Valid <%- targetName2 %>Model model){
		<%- targetName2 %>Model m = em.find(<%- targetName2 %>Model.class, model.getId());
		//TODO つめかえ
		em.merge(m);
		return Response.noContent().build();
	}
	
	@DELETE
	@Path("{id}")
	@Transactional
	public Response delete(@PathParam("id") Long id){
		<%- targetName2 %>Model m = em.find(<%- targetName2 %>Model.class,id);
		if(m != null){
			em.remove(m);
		}
		return Response.noContent().build();
	}
}
