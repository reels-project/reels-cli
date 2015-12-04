package <%- packageName %>.view;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.faces.view.ViewScoped;
import javax.inject.Named;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import <%- packageName %>.model.<%-targetName2%>Model;

@ViewScoped
@Named
@SuppressWarnings("serial")
public class <%-targetName2%>ListView implements Serializable{
	
	@PersistenceContext
	private EntityManager em;

	private <%-targetName2%>Model condition = new <%-targetName2%>Model();
	
	private List<<%-targetName2%>Model> <%-targetName%>Models;
	
	public List<<%-targetName2%>Model> get<%-targetName2%>Models(){
		if(<%-targetName%>Models == null){
			search();
		}
		return <%-targetName%>Models;
	}

	public <%-targetName2%>Model getCondition(){
		return this.condition;
	}

	public void search(){
		Map<String,Object> params = new LinkedHashMap<>();
		List<String> conditions = new ArrayList<>();

		//量産型検索条件たち
		<% columns.forEach(function(c){ %>
		<% if(c.javaType === 'String'){ %>
		if(getCondition().get<%-c.javaName%>() != null && !getCondition().get<%-c.javaName%>().isEmpty()){
		<% }else{ %>
		if(getCondition().get<%-c.javaName%>() != null){
		<% } %>
			conditions.add("s.<%-c.name%> = :<%-c.name%>");
			params.put("<%-c.name%>", getCondition().get<%-c.javaName%>());
		}
		<% }) %>

		String jpql = "select s from <%-targetName2%>Model s";
		String where = conditions.stream().collect(Collectors.joining(" and "));
		if(!where.isEmpty()){
		jpql = jpql + " where " + where;
		}

		TypedQuery<<%-targetName2%>Model> q = em.createQuery(jpql,<%-targetName2%>Model.class);
		params.entrySet().forEach(e -> q.setParameter(e.getKey(), e.getValue()));
		<%-targetName%>Models = q.getResultList();
	}
	
	@Transactional
	public String delete(Long id){
		<%-targetName2%>Model model = em.find(<%-targetName2%>Model.class, id);
		em.remove(model);
		
		return "/views/<%-targetName%>/list.xhtml?faces-redirect=true";
	}
}
